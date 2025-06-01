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
import { GeneralStatus } from '../../../common/enums/general.enum';
import { User } from '../../users/entities/user.entity';
import { License } from '../../licenses/entities/license.entity';
import { Organization } from './organization.entity';
import { LicensePeriodEnum } from '../../../common/enums/license-period.enum';
import { LicenseRequest } from '../../license-requests/entities/license-request.entity';

@Entity('organization_licenses')
export class OrganizationLicense extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(
    () => Organization,
    (organization) => organization.organization_licenses,
  )
  @JoinColumn({ name: 'organization_id' })
  organization_id: Organization;
  @Column({ nullable: true })
  description: string;
  @Column({ enum: LicensePeriodEnum })
  license_period: LicensePeriodEnum;
  @Column()
  license_period_count: number;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'requested_by' })
  requested_by: User;
  @Column({ nullable: true })
  license_reference_number: string;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'approved_by' })
  approved_by: User;
  @OneToOne(() => LicenseRequest)
  @JoinColumn({ name: 'license_request' })
  license_request: LicenseRequest;
  @Column({ enum: GeneralStatus, default: GeneralStatus.ENABLED })
  status: GeneralStatus;
  @Column()
  expires_at: Date;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
