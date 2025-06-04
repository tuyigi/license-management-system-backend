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
import { License } from './license.entity';

@Entity('license_system_tools')
export class LicenseToolEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => SystemTool)
  @JoinColumn({ name: 'system_tool' })
  system_tool: SystemTool;
  @ManyToOne(() => License)
  @JoinColumn({ name: 'license' })
  license: License;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
