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

@Entity('components')
export class ComponentEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ nullable: true })
  description: string;
  @Column()
  start_date: Date;
  @Column()
  expiry_date: Date;
  @ManyToOne(() => Contract)
  @JoinColumn({ name: 'contract' })
  contract: Contract;
  @Column({ nullable: true })
  host_server: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @Column()
  system_tool_name: string;
}
