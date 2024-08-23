import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Contract } from './contract.entity';
import { User } from '../../users/entities/user.entity';

@Entity('contract_reminders')
export class ContractReminderEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  reminder_date: Date;
  @ManyToOne(() => Contract)
  @JoinColumn({ name: 'contract' })
  contract: Contract;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user' })
  user: User;
  @Column({ nullable: true })
  description: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
