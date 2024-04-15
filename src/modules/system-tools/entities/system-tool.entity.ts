import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('system_tools')
export class SystemTool {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  system_tool_name: string;
  @Column('text', { nullable: true })
  description: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
