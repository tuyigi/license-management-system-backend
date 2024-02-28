import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { Repository } from 'typeorm';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { LicenseRequest } from '../../license-requests/entities/license-request.entity';
import { User } from '../../users/entities/user.entity';
import { OrganizationLicense } from '../../organizations/entities/organization_license.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(LicenseRequest)
    private readonly licenseRequestRepository: Repository<LicenseRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OrganizationLicense)
    private readonly organizationLicenseRepository: Repository<OrganizationLicense>,
  ) {}

  /*
  Get organizations stats by type
   */
  async getOrganizationTypeStats(): Promise<ResponseDataDto> {
    try {
      const qb = await this.organizationRepository
        .createQueryBuilder('organizations')
        .select(
          'COUNT(*) as total, organizations.organization_type',
          'organization_type',
        )
        .groupBy('organizations.organization_type')
        .getRawMany();
      return new ResponseDataDto(
        qb,
        200,
        `Organization Stats fetched successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get License request stats
   */
  async getLicenseRequestStats(): Promise<ResponseDataDto> {
    try {
      const qb = await this.licenseRequestRepository
        .createQueryBuilder('license_requests')
        .select(' COUNT(*) as total, license_requests.request_status')
        .groupBy('license_requests.request_status')
        .getRawMany();
      return new ResponseDataDto(
        qb,
        200,
        `License Request Stats fetched successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get General Status of total number of License requests,organizarions and users
   */
  async getGeneralStats(): Promise<ResponseDataDto> {
    try {
      const organizations: number = await this.organizationRepository.count();
      const users: number = await this.userRepository.count();
      const license_requests: number =
        await this.licenseRequestRepository.count();
      const responseData = {
        organizations,
        users,
        license_requests,
      };
      return new ResponseDataDto(
        responseData,
        200,
        `License Request Stats fetched successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get license request organization stats
   */

  async getLicenseRequestOrganizationStats(
    orgId: number,
  ): Promise<ResponseDataDto> {
    try {
      const qb = await this.licenseRequestRepository
        .createQueryBuilder('license_requests')
        .select(' COUNT(*) as total, license_requests.request_status')
        .where('license_requests.organization_id= :orgId', { orgId })
        .groupBy('license_requests.request_status')
        .getRawMany();
      return new ResponseDataDto(
        qb,
        200,
        `License Request Stats fetched successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
Get approved license type stats
 */

  async getApprovedLicenseTypeStats(): Promise<ResponseDataDto> {
    try {
      const qb = await this.licenseRequestRepository
        .createQueryBuilder('license_requests')
        .innerJoin('license_requests.license_id', 'l')
        .where('license_requests.request_status = :requestStatus', {
          requestStatus: 'APPROVED',
        })
        .groupBy('l.name')
        .select(['COUNT(*) as total', 'l.name'])
        .getRawMany();

      return new ResponseDataDto(
        qb,
        200,
        `License type Stats fetched successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Report of licenses with day left to their expiration date
   */
  async getLicenseReport(year: number): Promise<ResponseDataDto> {
    const queryBuilder = this.organizationLicenseRepository
      .createQueryBuilder('organization_licenses')
      .innerJoin('organization_licenses.license_id', 'license')
      .innerJoin('organization_licenses.license_request', 'lr')
      .select([
        `extract(day from (organization_licenses.expires_at::timestamp - now()::date::timestamp)) as day_left`,
        'organization_licenses.expires_at',
        'organization_licenses.license_period',
        'organization_licenses.license_period_count',
        'organization_licenses.expires_at',
        'organization_licenses.license_reference_number',
        'license.name',
        'license.description',
        'license.license_category',
        'organization_licenses.id',
        'organization_licenses.license_id',
        'organization_licenses.license_request',
      ])
      .where(`EXTRACT(YEAR FROM organization_licenses.expires_at) = :year`, {
        year,
      })
      .andWhere(
        `extract(day from (organization_licenses.expires_at::timestamp - now()::date::timestamp)) > 0`,
      )
      .orderBy('day_left', 'ASC');
    const result = await queryBuilder.getRawMany();
    return new ResponseDataDto(result, 200, 'Reports fetched successfully');
  }
}
