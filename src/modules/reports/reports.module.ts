import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../organizations/entities/organization.entity';
import { ReportController } from './controllers/report.controller';
import { ReportService } from './services/report.service';
import { LicenseRequest } from '../license-requests/entities/license-request.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, LicenseRequest, User])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportsModule {}
