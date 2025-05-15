import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Contract } from './entities/contract.entity';
import { ContractService } from './services/contract.service';
import { ContractController } from './controllers/contract.controller';
import { PaymentModule } from '../payments/payment.module';
import { SystemTool } from '../system-tools/entities/system-tool.entity';
import { DepartmentEntity } from '../departments/entities/department.entity';
import { ComponentEntity } from './entities/component.entity';
import { ContractSystemToolEntity } from './entities/contract-system-tool.entity';
import { ContractReminderEntity } from './entities/contract-reminder.entity';
import { User } from '../users/entities/user.entity';
import { ContractSystemToolMetricEntity } from './entities/contract-system-tool-metric.entity';
import { ComponentMetricEntity } from './entities/component-metric.entity';
import { MetricEntity } from '../metric/entities/metric.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    PaymentModule,
    MailModule,
    TypeOrmModule.forFeature([
      Vendor,
      Contract,
      SystemTool,
      DepartmentEntity,
      ComponentEntity,
      ContractSystemToolEntity,
      ContractReminderEntity,
      User,
      ContractSystemToolMetricEntity,
      ComponentMetricEntity,
      MetricEntity,
    ]),
  ],
  providers: [ContractService],
  controllers: [ContractController],
  exports: [ContractService],
})
export class ContractModule {}
