import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SystemTool } from '../../system-tools/entities/system-tool.entity';
import { Contract } from './contract.entity';
import { CurrencyEnum } from '../../../common/enums/currency.enum';

@Entity('contract_system_tools')
export class ContractSystemToolEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => SystemTool)
  system_tool: SystemTool;
  @ManyToOne(() => Contract)
  contract: Contract;
  @Column({ default: 0.0 })
  price: number;
  @Column({ enum: CurrencyEnum, nullable: true })
  currency: CurrencyEnum;
  @Column({ nullable: true })
  issue_date: Date;
  @Column({ nullable: true })
  expire_date: Date;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
