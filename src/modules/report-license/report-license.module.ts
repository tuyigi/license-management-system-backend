import { Module } from '@nestjs/common';
import { ReportLicenseService } from './services/report-license.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../payments/entities/payment.entity';
import { ReportLicense } from './entities/report-license.entity';
import { User } from '../users/entities/user.entity';
import { ReportLicenseController } from './controllers/report-license.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Payment, ReportLicense])],
  providers: [ReportLicenseService],
  controllers: [ReportLicenseController],
})
export class ReportLicenseModule {}
