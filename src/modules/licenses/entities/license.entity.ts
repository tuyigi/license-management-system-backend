import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { GeneralStatus } from '../../../common/enums/general.enum';
import { OrganizationLicense } from '../../organizations/entities/organization_license.entity';
import { LicenseRequest } from '../../license-requests/entities/license-request.entity';

@Entity('licenses')
export class License extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name: string;
  @Column({ unique: true })
  code: string;
  @Column()
  description: string;
  @Column({
    enum: GeneralStatus,
    default: GeneralStatus.ENABLED,
  })
  status: GeneralStatus;
  @OneToMany(
    () => OrganizationLicense,
    (organizationLicense) => organizationLicense.license_id,
  )
  organizations: OrganizationLicense[];
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
