import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Contract } from './entities/contract.entity';
import { ContractService } from './services/contract.service';
import { ContractController } from './controllers/contract.controller';
import { PaymentModule } from '../payments/payment.module';
import { SystemTool } from '../system-tools/entities/system-tool.entity';
import { DepartmentEntity } from '../departments/entities/department.entity';

@Module({
  imports: [
    PaymentModule,
    TypeOrmModule.forFeature([Vendor, Contract, SystemTool, DepartmentEntity]),
  ],
  providers: [ContractService],
  controllers: [ContractController],
})
export class ContractModule {}
