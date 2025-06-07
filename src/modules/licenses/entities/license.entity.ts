import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { GeneralStatus } from '../../../common/enums/general.enum';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { DepartmentEntity } from '../../departments/entities/department.entity';
import { SystemTool } from '../../system-tools/entities/system-tool.entity';
import { PaymentFrequencyEnum } from '../../../common/enums/payment-frequency.enum';
import { CurrencyEnum } from '../../../common/enums/currency.enum';
import { ApprovalStatusEnum } from '../../../common/enums/approval-status.enum';

@Entity('licenses')
export class License extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name: string;
  @Column({ unique: true })
  code: string;
  @Column()
  description: string;
  @Column({
    enum: GeneralStatus,
    default: GeneralStatus.ENABLED,
  })
  status: GeneralStatus;
  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @ManyToOne(() => DepartmentEntity)
  @JoinColumn({ name: 'department' })
  department_id: DepartmentEntity;
  @ManyToOne(() => SystemTool)
  @JoinColumn({ name: 'system_tool' })
  system_tool: SystemTool;
  @Column({ enum: PaymentFrequencyEnum, default: PaymentFrequencyEnum.YEAR })
  payment_frequency: PaymentFrequencyEnum;
  @Column('float')
  license_fees: number;
  @Column({ enum: CurrencyEnum, default: CurrencyEnum.USD })
  currency: CurrencyEnum;
  @Column()
  start_date: Date;
  @Column()
  end_date: Date;
  @Column({ default: 0 })
  number_system_users: number;
  @Column({ enum: ApprovalStatusEnum, default: ApprovalStatusEnum.PENDING })
  approval_status: ApprovalStatusEnum;
  @Column({ nullable: true })
  approval_comment: string;
}
