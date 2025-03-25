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
import { ComponentEntity } from './component.entity';

@Entity('component_metric')
export class ComponentMetricEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => ComponentEntity)
  @JoinColumn({ name: 'component' })
  component: ComponentEntity;
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
