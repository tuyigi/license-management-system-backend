import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContractSystemToolEntity } from './contract-system-tool.entity';
import { MetricEntity } from '../../metric/entities/metric.entity';

@Entity('contract_system_tool_metric')
export class ContractSystemToolMetricEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => ContractSystemToolEntity)
  @JoinColumn({ name: 'contract_system_tool' })
  contract_system_tool: ContractSystemToolEntity;
  @ManyToOne(() => MetricEntity)
  @JoinColumn({ name: 'metric' })
  metric: MetricEntity;
  @Column({ default: 0, nullable: true })
  entitlement: number;
  @Column({ default: 0, nullable: true })
  utilisation: number;
  @Column({ default: 0, nullable: true })
  license_gap: number;
  @Column({ nullable: true, type: 'text' })
  comment: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
