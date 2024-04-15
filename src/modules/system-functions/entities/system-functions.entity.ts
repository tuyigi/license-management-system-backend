import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SystemTool } from '../../system-tools/entities/system-tool.entity';
import { Functions } from './functions.entity';

@Entity('system_functions')
export class SystemFunctions extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => SystemTool)
  @JoinColumn({ name: 'system_tool' })
  system: SystemTool;
  @ManyToOne(() => Functions)
  @JoinColumn({ name: 'system_function' })
  system_function: Functions;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
