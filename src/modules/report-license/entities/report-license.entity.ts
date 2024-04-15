import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentStatusEnum } from '../../../common/enums/payment-status.enum';
import { User } from '../../users/entities/user.entity';
import { Payment } from '../../payments/entities/payment.entity';

@Entity('report_licenses')
export class ReportLicense {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  description: string;
  @Column()
  start_date: Date;
  @Column()
  end_date: Date;
  @Column()
  payment_reference: string;
  @Column('float')
  period_cost: number;
  @Column({ nullable: true })
  doc_reference_link: string;
  @Column({ enum: PaymentStatusEnum, default: PaymentStatusEnum.PENDING })
  payment_status: PaymentStatusEnum;
  @OneToOne(() => Payment)
  @JoinColumn({ name: 'payment_period' })
  payment_period: Payment;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
