import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LicenseRequestType } from '../../../common/enums/license-request-type.enum';
import { License } from '../../licenses/entities/license.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { User } from '../../users/entities/user.entity';
import { LicensePeriodEnum } from '../../../common/enums/license-period.enum';
import { LicenseRequestStatus } from '../../../common/enums/license-request-status.enum';
import { OrganizationLicense } from '../../organizations/entities/organization_license.entity';

@Entity('license_requests')
export class LicenseRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ enum: LicenseRequestType })
  request_type: LicenseRequestType;
  @ManyToOne(() => License)
  @JoinColumn({ name: 'license_id' })
  license_id: License;
  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization_id: Organization;
  @Column()
  description: string;
  @Column({ nullable: true })
  reason: string;
  @Column({ enum: LicensePeriodEnum })
  license_period: LicensePeriodEnum;
  @Column()
  license_period_count: number;
  @Column({ enum: LicenseRequestStatus, default: LicenseRequestStatus.PENDING })
  request_status: LicenseRequestStatus;
  @OneToOne(() => OrganizationLicense)
  organization_license: OrganizationLicense;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'requested_by' })
  requested_by: User;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
