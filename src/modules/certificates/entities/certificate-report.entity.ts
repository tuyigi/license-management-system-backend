import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CertificateEntity } from './certificate.entity';
import { User } from '../../users/entities/user.entity';

@Entity('certificate_reports')
export class CertificateReportEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => CertificateEntity)
  @JoinColumn({ name: 'certificate' })
  certificate_id: CertificateEntity;
  @Column()
  issue_date: Date;
  @Column()
  expiry_date: Date;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'responsible' })
  responsible: User;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
