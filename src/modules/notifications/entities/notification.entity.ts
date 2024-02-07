import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationType } from '../../../common/enums/notification-type.enum';
import { NotificationStatus } from '../../../common/enums/notification-status.enum';
import { Organization } from '../../organizations/entities/organization.entity';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  message: string;
  @Column({ enum: NotificationStatus })
  status: NotificationStatus;
  @Column({ enum: NotificationType })
  notification_type: NotificationType;
  @ManyToOne(() => Organization)
  organization_id: Organization;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
