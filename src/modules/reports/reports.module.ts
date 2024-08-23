import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../organizations/entities/organization.entity';
import { ReportController } from './controllers/report.controller';
import { ReportService } from './services/report.service';
import { LicenseRequest } from '../license-requests/entities/license-request.entity';
import { User } from '../users/entities/user.entity';
import { OrganizationLicense } from '../organizations/entities/organization_license.entity';
import { ReportLicense } from '../report-license/entities/report-license.entity';
import { DepartmentEntity } from '../departments/entities/department.entity';
import { Contract } from '../contracts/entities/contract.entity';
import { CertificateEntity } from '../certificates/entities/certificate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      LicenseRequest,
      User,
      OrganizationLicense,
      ReportLicense,
      DepartmentEntity,
      Contract,
      CertificateEntity,
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportsModule {}
