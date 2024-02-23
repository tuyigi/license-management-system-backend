import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationLicense } from '../../organizations/entities/organization_license.entity';
import { Repository } from 'typeorm';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { RequestLicenseDto } from '../dtos/request-license.dto';
import { Organization } from '../../organizations/entities/organization.entity';
import { User } from '../../users/entities/user.entity';
import { License } from '../../licenses/entities/license.entity';
import { LicenseRequest } from '../entities/license-request.entity';
import { ReportViewLicenseDto } from '../../../common/dtos/report-view-license.dto';
import { LicenseRequestStatus } from '../../../common/enums/license-request-status.enum';
import { RequestAuditTrail } from '../entities/request-audit-trail.entity';
import { ActionType } from '../../../common/enums/action-type.enum';
import { DecisionLicenseRequestDto } from '../dtos/decision-license-request.dto';
import { LicensePeriodEnum } from '../../../common/enums/license-period.enum';
import { UserType } from '../../../common/enums/user_type.enum';
import { generateQrCode } from '../../../common/utils/generate-qrcode.utils';

import { readFileSync } from 'fs';
import { join } from 'path';
import { GeneralStatus } from '../../../common/enums/general.enum';
import { LicenseCategory } from '../../../common/enums/license_category.enum';

@Injectable()
export class LicenseRequestService {
  constructor(
    @InjectRepository(OrganizationLicense)
    private readonly organizationLicenseRepository: Repository<OrganizationLicense>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(License)
    private readonly licenseReporistory: Repository<License>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(LicenseRequest)
    private readonly licenseRequestRepository: Repository<LicenseRequest>,
    @InjectRepository(RequestAuditTrail)
    private readonly requestAuditTrailRepository: Repository<RequestAuditTrail>,
  ) {}

  /*
  Request organization license
   */
  async requestLisence(
    requestLicenseDto: RequestLicenseDto,
  ): Promise<ResponseDataDto> {
    try {
      const {
        license_id,
        organization_id,
        description,
        license_period,
        license_period_count,
        requested_by,
        request_type,
      } = requestLicenseDto;
      // validate period count
      if (license_period_count <= 0)
        throw new BadRequestException(`Invalid license period count`);
      // validate organization
      const organization: Organization =
        await this.organizationRepository.findOne({
          where: { id: organization_id },
        });
      if (!organization)
        throw new NotFoundException(
          `Organization with ID: ${organization_id} not found`,
        );
      // validate user
      const user: User = await this.userRepository.findOne({
        where: { id: requested_by },
        relations: { organization_id: true },
      });
      if (!user)
        throw new NotFoundException(`User with ID: ${requested_by} not found`);
      // validate license
      const license: License = await this.licenseReporistory.findOne({
        where: { id: license_id },
      });
      if (!license)
        throw new NotFoundException(`License with ID: ${license_id} not found`);

      // check user and organization
      if (user.organization_id.id !== organization.id)
        throw new BadRequestException(
          `User with ID: ${requested_by} is not associated to organization with ID: ${organization_id}`,
        );
      // check if organization has a pending license request on same license
      const request_status: string = 'PENDING';
      const licenseRequests_ = await this.licenseRequestRepository
        .createQueryBuilder('license_requests')
        .where('license_requests.organization_id = :organization_id', {
          organization_id,
        })
        .andWhere('license_requests.license_id = :license_id', { license_id })
        .andWhere('license_requests.request_status = :request_status', {
          request_status,
        })
        .getCount();
      if (licenseRequests_ > 0)
        throw new BadRequestException(
          `You can't request the same license while you have other pending request`,
        );
      const licenseRequest = new LicenseRequest();
      licenseRequest.license_id = license;
      licenseRequest.license_period = license_period;
      licenseRequest.organization_id = organization;
      licenseRequest.license_period_count = license_period_count;
      licenseRequest.request_type = request_type;
      licenseRequest.requested_by = user;
      licenseRequest.description = description;
      const savedRequest =
        await this.licenseRequestRepository.save(licenseRequest);
      return new ResponseDataDto(
        savedRequest,
        201,
        'License request sent successfully',
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get Requested license of organization
   */
  async getOrganizationRequestedLicense(id: number): Promise<ResponseDataDto> {
    const organization: Organization =
      await this.organizationRepository.findOne({ where: { id } });
    if (!organization)
      throw new NotFoundException(`Organization with ID: ${id} not found`);
    const license_rquests = await this.licenseRequestRepository.find({
      relations: { license_id: true },
      where: { organization_id: { id } },
      order: { created_at: 'DESC' },
    });
    return new ResponseDataDto(
      license_rquests,
      200,
      'Requested license retrieved successfully',
    );
  }

  /*
  Get requested licenses
   */
  async getRequestedLicenses(): Promise<ResponseDataDto> {
    const licenseRequested: LicenseRequest[] =
      await this.licenseRequestRepository.find({
        relations: { organization_id: true, license_id: { vendor: true } },
        order: {
          created_at: 'DESC',
        },
      });
    return new ResponseDataDto(
      licenseRequested,
      200,
      'Requested license retrieved successfully',
    );
  }

  /*
  Get One requested license by ID
   */
  async getOneRequestedLicense(id: number): Promise<ResponseDataDto> {
    const requestedLicense: LicenseRequest =
      await this.licenseRequestRepository.findOne({
        relations: { organization_id: true, license_id: true },
        where: { id },
      });
    if (!requestedLicense)
      throw new NotFoundException(`Requested license with ID: ${id} not found`);
    return new ResponseDataDto(
      requestedLicense,
      200,
      'Requested License retrieved successfully',
    );
  }

  /*
  Report view of license request
   */

  async reportViewLicenseRequest(
    id: number,
    reportViewLicenseDto: ReportViewLicenseDto,
  ): Promise<ResponseDataDto> {
    try {
      const { user_id } = reportViewLicenseDto;
      const licenseRequest: LicenseRequest =
        await this.licenseRequestRepository.findOne({
          relations: { license_id: true },
          where: { id },
        });
      if (!licenseRequest)
        throw new NotFoundException(`License request with ID: ${id} not found`);
      const user: User = await this.userRepository.findOne({
        where: { id: user_id },
      });
      if (!user)
        throw new NotFoundException(`User with ID: ${user_id} not found`);
      if (licenseRequest.request_status !== LicenseRequestStatus.PENDING)
        throw new BadRequestException(`License request is not pending`);
      // update license request status
      licenseRequest.request_status = LicenseRequestStatus.REVIEWED;
      await this.licenseRequestRepository.save(licenseRequest);
      // check if audit trail is not already recorded
      let requestAuditTrail = await this.requestAuditTrailRepository.findOne({
        where: {
          action_type: ActionType.REVIEWED,
          request_id: { id: licenseRequest.id },
        },
      });
      if (requestAuditTrail)
        throw new BadRequestException(
          `Audit trail for review is already recorded!`,
        );
      // record audit
      requestAuditTrail = new RequestAuditTrail();
      requestAuditTrail.user_id = user;
      requestAuditTrail.request_id = licenseRequest;
      requestAuditTrail.action_type = ActionType.REVIEWED;
      const savedAudit: RequestAuditTrail =
        await this.requestAuditTrailRepository.save(requestAuditTrail);
      return new ResponseDataDto(
        savedAudit,
        201,
        'Audit trail recorded successfully',
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Reject/approve license request
   */

  async rejectOrApproveLicenseRequest(
    id: number,
    rejectLicenseRequestDto: DecisionLicenseRequestDto,
  ): Promise<ResponseDataDto> {
    try {
      const { decision, user_id } = rejectLicenseRequestDto;
      const licenseRequest: LicenseRequest =
        await this.licenseRequestRepository.findOne({
          relations: { license_id: true, organization_id: true },
          where: {
            id,
            request_status: LicenseRequestStatus.REVIEWED,
          },
        });
      if (!licenseRequest)
        throw new NotFoundException(
          `License request with ID: ${id} not found or not yet reviewed`,
        );
      const user: User = await this.userRepository.findOne({
        where: { id: user_id },
      });
      if (!user)
        throw new NotFoundException(`User with ID: ${user_id} not found`);
      // check license manager decision
      switch (decision) {
        case ActionType.REJECTED:
          return await this.rejectLicenseRequest(
            licenseRequest,
            user,
            rejectLicenseRequestDto,
          );
        case ActionType.APPROVED:
          return await this.approveLicenseRequest(licenseRequest, user);
      }
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  reject license request
   */

  async rejectLicenseRequest(
    licenseRequest: LicenseRequest,
    user: User,
    rejectLicenseRequestDto: DecisionLicenseRequestDto,
  ): Promise<ResponseDataDto> {
    try {
      const { reason } = rejectLicenseRequestDto;
      // check if user provided valid reason for rejection
      if (!reason) throw new BadRequestException(`Please valid reason`);
      licenseRequest.request_status = LicenseRequestStatus.REJECTED;
      licenseRequest.reason = reason;
      await this.licenseRequestRepository.save(licenseRequest);
      // record audit
      const requestAudit = new RequestAuditTrail();
      requestAudit.request_id = licenseRequest;
      requestAudit.user_id = user;
      requestAudit.action_type = ActionType.REJECTED;
      await this.requestAuditTrailRepository.save(requestAudit);
      // TODO: notify organization about its license request
      return new ResponseDataDto(
        licenseRequest,
        200,
        'License request rejected successfully',
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Approve license request
   */

  async approveLicenseRequest(
    licenseRequest: LicenseRequest,
    user: User,
  ): Promise<ResponseDataDto> {
    try {
      // check user type if is license manager
      if (user.user_type !== UserType.LICENSE_MANAGER)
        throw new BadRequestException(
          `User ${user.first_name} ${user.last_name} with type ${user.user_type} is not allowed to approve license request`,
        );
      licenseRequest.request_status = LicenseRequestStatus.APPROVED;
      // TODO:  check if it is renewal or new license
      const organizationLicense = new OrganizationLicense();
      // if (licenseRequest.request_type == LicenseRequestType.RENEWAL) {
      //   organizationLicense = await this.organizationLicenseRepository.findOne({
      //     where: { organization_id: licenseRequest.organization_id, license_id: licenseRequest.license_id,   },
      //   });
      // }
      // record organization license
      organizationLicense.license_period_count =
        licenseRequest.license_period_count;
      organizationLicense.license_period = licenseRequest.license_period;
      organizationLicense.approved_by = user;
      organizationLicense.license_request = licenseRequest;
      organizationLicense.license_id = licenseRequest.license_id;
      organizationLicense.requested_by = licenseRequest.requested_by;
      organizationLicense.organization_id = licenseRequest.organization_id;
      // calculate expire date
      const currentDate = new Date();
      let expireDate: Date = new Date();
      switch (licenseRequest.license_period) {
        case LicensePeriodEnum.MONTH:
          expireDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + licenseRequest.license_period_count,
            currentDate.getDate(),
          );
          break;
        case LicensePeriodEnum.YEAR:
          expireDate = new Date(
            currentDate.getFullYear() + licenseRequest.license_period_count,
            currentDate.getMonth(),
            currentDate.getDate(),
          );
          break;
      }
      organizationLicense.expires_at = expireDate;
      const recordedOrganizationLicense: OrganizationLicense =
        await this.organizationLicenseRepository.save(organizationLicense);
      // generate license reference number
      const organizationLicenseReferenceNumber: string = `${recordedOrganizationLicense.license_id.name}-${recordedOrganizationLicense.id.toString().padStart(3, '0')}`;
      recordedOrganizationLicense.license_reference_number =
        organizationLicenseReferenceNumber;
      await this.organizationLicenseRepository.save(organizationLicense);
      // record audit
      const requestAudit = new RequestAuditTrail();
      requestAudit.request_id = licenseRequest;
      requestAudit.user_id = user;
      requestAudit.action_type = ActionType.REJECTED;
      await this.requestAuditTrailRepository.save(requestAudit);
      // update license request
      licenseRequest.request_status = LicenseRequestStatus.APPROVED;
      //  Generate License PDF File from utils if license category is institution license
      if (
        licenseRequest.license_id.license_category ===
        LicenseCategory.INSTITUTION_LICENSE
      ) {
        const licensePdfData = {
          license_number: organizationLicenseReferenceNumber,
          organization_name: recordedOrganizationLicense.organization_id.name,
          organization_address: `${recordedOrganizationLicense.organization_id.province}`,
          license_description: licenseRequest.license_id.description,
          start_date: `${recordedOrganizationLicense.created_at}`,
          expiry_date: `${recordedOrganizationLicense.expires_at}`,
          approved_by: `${recordedOrganizationLicense.approved_by.first_name} ${recordedOrganizationLicense.approved_by.last_name}`,
        };
        await generateQrCode(licensePdfData);
      }
      // TODO: Notify organization that their license request was approved
      await this.licenseRequestRepository.save(licenseRequest);
      return new ResponseDataDto(
        licenseRequest,
        200,
        'License request approved successfully',
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Download Organization license by license request ID
   */
  async downloadOrganizationLicense(licenseId: number) {
    const organizationLicense: OrganizationLicense =
      await this.organizationLicenseRepository.findOne({
        where: {
          license_request: { id: licenseId },
          status: GeneralStatus.ENABLED,
        },
      });
    if (!organizationLicense)
      throw new NotFoundException(
        `Organization license with ID: ${licenseId} not found`,
      );
    return readFileSync(
      join(
        process.cwd(),
        `./src/assets/licenses/${organizationLicense.license_reference_number}.pdf`,
      ),
    );
  }

  /*
  Download Organization license by license reference number
 */

  async downloadOrganizationLicenseByReference(licenseNumber: string) {
    const organizationLicense: OrganizationLicense =
      await this.organizationLicenseRepository.findOne({
        where: {
          license_reference_number: licenseNumber,
          status: GeneralStatus.ENABLED,
        },
      });
    if (!organizationLicense)
      throw new NotFoundException(
        `Organization license with license reference number: ${licenseNumber} not found`,
      );
    return readFileSync(
      join(
        process.cwd(),
        `./src/assets/licenses/${organizationLicense.license_reference_number}.pdf`,
      ),
    );
  }
}
