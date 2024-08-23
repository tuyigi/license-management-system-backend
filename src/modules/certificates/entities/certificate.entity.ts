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
import { CertificateTypeEnum } from '../enums/certificate-type.enum';
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
  @Column({ nullable: true })
  issue_date: Date;
  @Column({ nullable: true })
  expiry_date: Date;
  @Column({ enum: CertificateTypeEnum, nullable: true })
  certificate_type: CertificateTypeEnum;
  @ManyToOne(() => DepartmentEntity)
  @JoinColumn({ name: 'department' })
  department_id: DepartmentEntity;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
