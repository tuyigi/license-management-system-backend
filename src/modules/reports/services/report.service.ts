import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { Repository } from 'typeorm';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { LicenseRequest } from '../../license-requests/entities/license-request.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(LicenseRequest)
    private readonly licenseRequestRepository: Repository<LicenseRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /*
  Get organizations stats by type
   */
  async getOrganizationTypeStats(): Promise<ResponseDataDto> {
    try {
      const qb = await this.organizationRepository
        .createQueryBuilder('organizations')
        .select('COUNT(*) as total, organizations.organization_type', 'result')
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
}
