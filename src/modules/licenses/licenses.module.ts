import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { License } from './entities/license.entity';
import { LicenseService } from './services/license.service';
import { LicenseController } from './controllers/license.controller';
import { LicenseRequest } from '../license-requests/entities/license-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([License, LicenseRequest])],
  providers: [LicenseService],
  controllers: [LicenseController],
})
export class LicensesModule {}
