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
import { MetricEntity } from '../../metric/entities/metric.entity';
import { SystemTool } from '../../system-tools/entities/system-tool.entity';
import { ContractSystemToolEntity } from '../../contracts/entities/contract-system-tool.entity';
import { LicenseToolEntity } from './license-tool.entity';
import { ApprovalStatusEnum } from '../../../common/enums/approval-status.enum';

@Entity('license_tool_metric')
export class LicenseToolMetricEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => LicenseToolEntity)
  @JoinColumn({ name: 'license_system_tool' })
  license_system_tool: LicenseToolEntity;
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
  @Column({ enum: ApprovalStatusEnum, default: ApprovalStatusEnum.PENDING })
  approval_status: ApprovalStatusEnum;
  @Column({ nullable: true })
  approval_comment: string;
}
