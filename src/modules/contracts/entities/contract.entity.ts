import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { CurrencyEnum } from '../../../common/enums/currency.enum';
import { PaymentFrequencyEnum } from '../../../common/enums/payment-frequency.enum';
import { Payment } from '../../payments/entities/payment.entity';
import { SystemTool } from '../../system-tools/entities/system-tool.entity';
import { ContractStatusEnum } from '../../../common/enums/contract-status.enum';
import { DepartmentEntity } from '../../departments/entities/department.entity';
import { ApprovalStatusEnum } from '../../../common/enums/approval-status.enum';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendor' })
  vendor: Vendor;
  @Column({ unique: true })
  contract_number: string;
  @Column({ enum: PaymentFrequencyEnum, default: PaymentFrequencyEnum.YEAR })
  payment_frequency: PaymentFrequencyEnum;
  @Column('float')
  annual_license_fees: number;
  @Column({ enum: CurrencyEnum, default: CurrencyEnum.USD })
  currency: CurrencyEnum;
  @Column()
  start_date: Date;
  @Column()
  end_date: Date;
  @OneToMany(() => Payment, (p) => p.contract)
  payments: Payment[];
  @Column({ type: 'text', nullable: true })
  description: string;
  @Column({ enum: ContractStatusEnum, default: ContractStatusEnum.VALID })
  contract_status: ContractStatusEnum;
  @Column({ nullable: true })
  document_link: string;
  @Column({ default: 0 })
  number_system_users: number;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @ManyToOne(() => SystemTool)
  @JoinColumn({ name: 'system_tool' })
  system_tool: SystemTool;
  @ManyToOne(() => DepartmentEntity)
  @JoinColumn({ name: 'department' })
  department: DepartmentEntity;
  @Column({ enum: ApprovalStatusEnum, default: ApprovalStatusEnum.PENDING })
  approval_status: ApprovalStatusEnum;
}
