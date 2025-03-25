import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { Repository } from 'typeorm';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { LicenseRequest } from '../../license-requests/entities/license-request.entity';
import { User } from '../../users/entities/user.entity';
import { OrganizationLicense } from '../../organizations/entities/organization_license.entity';
import { ReportLicense } from '../../report-license/entities/report-license.entity';
import { DepartmentEntity } from '../../departments/entities/department.entity';
import { Contract } from '../../contracts/entities/contract.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { CertificateEntity } from '../../certificates/entities/certificate.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { CertificateReportEntity } from '../../certificates/entities/certificate-report.entity';
import { CertificateFilterDto } from '../dtos/certificate-filters.dto';
import { ComponentFilters } from '../dtos/component-filters.dto';
import { ComponentEntity } from '../../contracts/entities/component.entity';
import { SystemToolFilters } from '../dtos/SystemTool-filters';
import { ContractSystemToolEntity } from '../../contracts/entities/contract-system-tool.entity';
import { MetricFiltersDto } from '../dtos/metric-filters.dto';

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
    @InjectRepository(ReportLicense)
    private readonly reportLicenseRepository: Repository<ReportLicense>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
    @InjectRepository(CertificateEntity)
    private readonly certificateRepository: Repository<CertificateEntity>,
    @InjectRepository(CertificateReportEntity)
    private readonly certificateReportRepository: Repository<CertificateReportEntity>,
    @InjectRepository(ComponentEntity)
    private readonly componentReportRepository: Repository<ComponentEntity>,
    @InjectRepository(ContractSystemToolEntity)
    private readonly systemToolReportRepository: Repository<ContractSystemToolEntity>,
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

  /*
  Get summary of reported license ( license owner)
   */
  async getRecordedLicenseSummary(): Promise<ResponseDataDto> {
    try {
      const current_year = new Date().getFullYear();
      const paidLicense = await this.reportLicenseRepository
        .createQueryBuilder('report_licenses')
        .where(
          `EXTRACT(YEAR FROM report_licenses.created_at) = :current_year and payment_status = 'PAID'`,
          {
            current_year,
          },
        )
        .getCount();
      const licenseExpiredMonth = await this.reportLicenseRepository
        .createQueryBuilder('report_licenses')
        .where(
          `extract(day from (report_licenses.end_date::timestamp - now()::date::timestamp)) <= 31 and extract(day from (report_licenses.end_date::timestamp - now()::date::timestamp)) > 0`,
        )
        .andWhere(
          `EXTRACT(YEAR FROM report_licenses.end_date) = :current_year`,
          { current_year },
        )
        .getCount();
      const data = {
        paid_license: paidLicense,
        license_expiration_month: licenseExpiredMonth,
      };
      return new ResponseDataDto(
        data,
        200,
        `License summary fetched successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Check Department
   */
  async checkDepartment(id: number): Promise<DepartmentEntity> {
    try {
      const department: DepartmentEntity =
        await this.departmentRepository.findOne({ where: { id } });
      if (!department)
        throw new NotFoundException(`Department with ID: ${id} not found`);
      return department;
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get total contract per department
   */
  async getTotalDepartment(id: number): Promise<ResponseDataDto> {
    try {
      const department: DepartmentEntity = await this.checkDepartment(id);
      const total_contracts: number = await this.contractRepository.countBy({
        department: { id },
      });
      const responseData = { department, total_contracts };
      return new ResponseDataDto(responseData);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get contract period payments summary of specific department
   */
  async getContractPeriodPayments(id: number): Promise<ResponseDataDto> {
    try {
      const department: DepartmentEntity = await this.checkDepartment(id);
      const summary = await this.contractRepository
        .createQueryBuilder('c')
        .select('COUNT(*)', 'count')
        .addSelect('p.payment_status', 'payment_status')
        .innerJoin(Payment, 'p', 'c.id = p.contract')
        .where('c.department = :department', { department: department.id })
        .groupBy('p.payment_status')
        .getRawMany();
      return new ResponseDataDto(summary);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get numbers of certificates in specific department
   */
  async getCertificateNumbers(id: number): Promise<ResponseDataDto> {
    try {
      const department = await this.checkDepartment(id);
      const total_certificates = await this.certificateRepository.countBy({
        department_id: { id: department.id },
      });
      const responseData = { department, total_certificates };
      return new ResponseDataDto(responseData);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get vendors payment numbers summary per specific department
   */
  async getVendorPayments(id: number): Promise<ResponseDataDto> {
    try {
      const department = await this.checkDepartment(id);
      const report = await this.contractRepository
        .createQueryBuilder('c')
        .select('COUNT(*)', 'count')
        .addSelect('v.vendor_name', 'vendor_name')
        .innerJoin(Vendor, 'v', 'v.id = c.vendor')
        .innerJoin(Payment, 'p', 'c.id = p.contract')
        .where('c.department = :department', { department: department.id })
        .groupBy('v.vendor_name')
        .getRawMany();
      return new ResponseDataDto(report);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get Certificate reports by year
   */
  async getCertificateReport(
    certificateFilterDto: CertificateFilterDto,
  ): Promise<ResponseDataDto> {
    try {
      const queryBuilder = this.certificateReportRepository
        .createQueryBuilder('certificate_reports')
        .innerJoin(
          'certificate_reports.certificate_id',
          'certificates',
          'certificate_reports.certificate = certificates.id',
        )
        .innerJoin('certificate_reports.responsible', 'user')
        .select([
          `extract(day from (certificate_reports.expiry_date::timestamp - now()::date::timestamp)) as day_left`,
          `TO_CHAR(certificate_reports.expiry_date, 'dd/mm/yyyy') as expiry_date`,
          `TO_CHAR(certificate_reports.issue_date, 'dd/mm/yyyy') as issue_date`,
          'certificate_reports.certificate',
          'certificate_reports.responsible',
          'certificates.certificate as name',
          'certificates.description',
          'certificates.user_organization',
          'certificates.certificate_type',
        ])
        .where(
          `extract(day from (certificate_reports.expiry_date::timestamp - now()::date::timestamp)) >= 0`,
        );
      if (certificateFilterDto?.year) {
        queryBuilder.andWhere(
          `EXTRACT(YEAR FROM certificate_reports.expiry_date) = :year`,
          {
            year: certificateFilterDto.year,
          },
        );
      }
      if (certificateFilterDto?.user_id) {
        queryBuilder.andWhere(`certificate_reports.responsible = :user_id`, {
          user_id: certificateFilterDto.user_id,
        });
      }
      queryBuilder.orderBy('day_left', 'ASC');
      const result = await queryBuilder.getRawMany();
      return new ResponseDataDto(result, 200, 'Reports fetched successfully');
    } catch (e) {
      throw e;
    }
  }

  /*
  Get Components report along side with expiry date
   */
  async getComponentsReport(
    componentFilters: ComponentFilters,
  ): Promise<ResponseDataDto> {
    try {
      const queryBuilder = this.componentReportRepository
        .createQueryBuilder('components')
        .innerJoin('components.contract', 'contract')
        .select([
          `extract(day from (components.expiry_date::timestamp - now()::date::timestamp)) as day_left`,
          `TO_CHAR(components.expiry_date, 'dd/mm/yyyy') as expiry_date`,
          `TO_CHAR(components.start_date, 'dd/mm/yyyy') as start_date`,
          'components.name',
          'components.description',
          'contract.contract_number',
        ])
        .where(
          `extract(day from (components.expiry_date::timestamp - now()::date::timestamp)) >= 0`,
        );
      if (componentFilters?.year) {
        queryBuilder.andWhere(
          `EXTRACT(YEAR FROM components.expiry_date) = :year`,
          {
            year: componentFilters.year,
          },
        );
      }
      if (componentFilters?.department) {
        queryBuilder.andWhere(`contract.department = :department`, {
          department: componentFilters.department,
        });
      }
      queryBuilder.orderBy('day_left', 'ASC');
      const result = await queryBuilder.getRawMany();
      return new ResponseDataDto(result, 200, 'Reports fetched successfully');
    } catch (e) {
      throw e;
    }
  }

  /*
  Get System tools report
   */
  async getSystemToolReport(
    systemToolFilters: SystemToolFilters,
  ): Promise<ResponseDataDto> {
    try {
      const queryBuilder = this.systemToolReportRepository
        .createQueryBuilder('contract_system_tools')
        .innerJoin('contract_system_tools.contract', 'contract')
        .innerJoin('contract_system_tools.system_tool', 'system_tool')
        .select([
          `extract(day from (contract_system_tools.expire_date::timestamp - now()::date::timestamp)) as day_left`,
          `TO_CHAR(contract_system_tools.expire_date, 'dd/mm/yyyy') as expire_date`,
          `TO_CHAR(contract_system_tools.issue_date, 'dd/mm/yyyy') as issue_date `,
          'contract_system_tools.price',
          'contract_system_tools.currency',
          'system_tool.system_tool_name as system_tool_name',
          'system_tool.description as system_tool_description',
          'contract.contract_number',
        ])
        .where(
          `extract(day from (contract_system_tools.expire_date::timestamp - now()::date::timestamp)) >= 0`,
        );
      if (systemToolFilters?.year) {
        queryBuilder.andWhere(
          `EXTRACT(YEAR FROM contract_system_tools.expire_date) = :year`,
          {
            year: systemToolFilters.year,
          },
        );
      }
      if (systemToolFilters?.department) {
        queryBuilder.andWhere(`contract.department = :department`, {
          department: systemToolFilters.department,
        });
      }
      queryBuilder.orderBy('day_left', 'ASC');
      const result = await queryBuilder.getRawMany();
      return new ResponseDataDto(result, 200, 'Reports fetched successfully');
    } catch (e) {
      throw e;
    }
  }

  /*
  Metrics :: Numbers of expiring per month
   */
  async getCertificateMetrics(
    metricFiltersDto: MetricFiltersDto,
  ): Promise<ResponseDataDto> {
    try {
      const currentYear = new Date().getFullYear();
      const queryBuilder = this.certificateReportRepository
        .createQueryBuilder('certificate_reports')
        .innerJoin(
          'certificate_reports.certificate_id',
          'certificates',
          'certificate_reports.certificate = certificates.id',
        )
        .innerJoin('certificate_reports.responsible', 'user')
        .select([
          `to_char(to_timestamp (EXTRACT(MONTH FROM certificate_reports.expiry_date)::text, 'MM'), 'TMmon') as month`,
          'count(*) as total',
        ])
        .where(
          `extract(day from (certificate_reports.expiry_date::timestamp - now()::date::timestamp)) >= 0`,
        );
      // add condition of current year
      queryBuilder.andWhere(
        `EXTRACT(YEAR FROM certificate_reports.expiry_date) = :year`,
        {
          year: currentYear,
        },
      );
      if (metricFiltersDto?.user_id) {
        queryBuilder.andWhere(`certificate_reports.responsible = :user_id`, {
          user_id: metricFiltersDto.user_id,
        });
      }
      queryBuilder.groupBy(
        'EXTRACT(MONTH FROM certificate_reports.expiry_date)',
      );
      const result = await queryBuilder.getRawMany();
      return new ResponseDataDto(result, 200, 'Reports fetched successfully');
    } catch (e) {
      throw e;
    }
  }

  /*
  Metrics :: Numbers of expiring Component per month
   */
  async getComponentMetrics(
    metricFiltersDto: MetricFiltersDto,
  ): Promise<ResponseDataDto> {
    try {
      const currentYear = new Date().getFullYear();
      const queryBuilder = this.componentReportRepository
        .createQueryBuilder('components')
        .innerJoin('components.contract', 'contract')
        .select([
          `extract(day from (components.expiry_date::timestamp - now()::date::timestamp)) as day_left`,
          `TO_CHAR(components.expiry_date, 'dd/mm/yyyy') as expiry_date`,
          `TO_CHAR(components.start_date, 'dd/mm/yyyy') as start_date`,
          'components.name',
          'components.description',
          'contract.contract_number',
        ])
        .where(
          `extract(day from (components.expiry_date::timestamp - now()::date::timestamp)) >= 0`,
        );
      queryBuilder.andWhere(
        `EXTRACT(YEAR FROM components.expiry_date) = :year`,
        {
          year: currentYear,
        },
      );
      queryBuilder.orderBy('day_left', 'ASC');
      const result = await queryBuilder.getRawMany();
      return new ResponseDataDto(result, 200, 'Reports fetched successfully');
    } catch (e) {
      throw e;
    }
  }

  /*
  Get Metrics of all Components,Certificates and System tool
   */
  async getAllMetrics(): Promise<ResponseDataDto> {
    try {
      const currentYear = new Date().getFullYear();

      // system tool
      const queryBuilder = this.systemToolReportRepository
        .createQueryBuilder('contract_system_tools')
        .select([`count(*) as total`])
        .where(
          `extract(day from (contract_system_tools.expire_date::timestamp - now()::date::timestamp)) >= 1`,
        );
      queryBuilder.andWhere(
        `EXTRACT(YEAR FROM contract_system_tools.expire_date) = :year`,
        {
          year: currentYear,
        },
      );
      const resultSystemTool = await queryBuilder.getCount();

      // certificate
      const queryBuilderCertificate = this.certificateReportRepository
        .createQueryBuilder('certificate_reports')
        .select([`count(*) as total`])
        .where(
          `extract(day from (certificate_reports.expiry_date::timestamp - now()::date::timestamp)) >= 0`,
        );
      queryBuilder.andWhere(
        `EXTRACT(YEAR FROM certificate_reports.expiry_date) = :year`,
        {
          year: currentYear,
        },
      );
      const resultCertificate = await queryBuilderCertificate.getCount();

      // components

      const queryBuilderComponent = this.componentReportRepository
        .createQueryBuilder('components')
        .select([`count(*) as total`])
        .where(
          `extract(day from (components.expiry_date::timestamp - now()::date::timestamp)) >= 0`,
        );
      queryBuilderComponent.andWhere(
        `EXTRACT(YEAR FROM components.expiry_date) = :year`,
        {
          year: currentYear,
        },
      );
      const resultComponent = await queryBuilderComponent.getCount();
      const data = [];
      data.push({ name: 'Certificates', total: resultCertificate });
      data.push({ name: 'Components', total: resultComponent });
      data.push({ name: 'Tools', total: resultSystemTool });
      return new ResponseDataDto(data);
    } catch (e) {
      throw e;
    }
  }
}
