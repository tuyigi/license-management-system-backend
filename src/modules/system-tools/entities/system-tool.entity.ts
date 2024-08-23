import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DepartmentEntity } from '../../departments/entities/department.entity';

@Entity('system_tools')
export class SystemTool {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  system_tool_name: string;
  @Column('text', { nullable: true })
  description: string;
  @ManyToOne(() => DepartmentEntity)
  @JoinColumn({ name: 'department' })
  department: DepartmentEntity;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
