import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ActionType } from '../../../common/enums/action-type.enum';
import { User } from '../../users/entities/user.entity';
import { LicenseRequest } from './license-request.entity';

@Entity('request_audit_trails')
export class RequestAuditTrail {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ enum: ActionType, default: ActionType.REVIEWED })
  action_type: ActionType;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user_id: User;
  @ManyToOne(() => LicenseRequest)
  @JoinColumn({ name: 'request_id' })
  request_id: LicenseRequest;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
