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
@Entity('certificates')
export class CertificateEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  certificate: string;
  @Column({ nullable: true })
  description: string;
  @Column({ nullable: true })
  user_organization: string;
  @ManyToOne(() => DepartmentEntity)
  @JoinColumn({ name: 'department' })
  department_id: DepartmentEntity;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
