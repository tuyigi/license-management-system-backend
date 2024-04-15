import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentStatusEnum } from '../../../common/enums/payment-status.enum';
import { Contract } from '../../contracts/entities/contract.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  start_period: Date;
  @Column()
  end_period: Date;
  @Column('float')
  payment_fee: number;
  @Column({ enum: PaymentStatusEnum, default: PaymentStatusEnum.PENDING })
  payment_status: PaymentStatusEnum;
  @Column()
  order_number: number;
  @ManyToOne(() => Contract)
  @JoinColumn({ name: 'contract' })
  contract: Contract;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
