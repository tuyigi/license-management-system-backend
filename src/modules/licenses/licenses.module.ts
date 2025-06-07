import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { License } from './entities/license.entity';
import { LicenseService } from './services/license.service';
import { LicenseController } from './controllers/license.controller';
import { LicenseRequest } from '../license-requests/entities/license-request.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { SystemTool } from '../system-tools/entities/system-tool.entity';
import { DepartmentEntity } from '../departments/entities/department.entity';
import { LicenseToolMetricEntity } from './entities/license-tool-metric.entity';
import { LicenseToolEntity } from './entities/license-tool.entity';
import { MetricEntity } from '../metric/entities/metric.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      License,
      LicenseRequest,
      Vendor,
      SystemTool,
      DepartmentEntity,
      LicenseToolMetricEntity,
      LicenseToolEntity,
      MetricEntity,
    ]),
  ],
  providers: [LicenseService],
  controllers: [LicenseController],
})
export class LicensesModule {}
