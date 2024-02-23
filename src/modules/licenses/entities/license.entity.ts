import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { GeneralStatus } from '../../../common/enums/general.enum';
import { OrganizationLicense } from '../../organizations/entities/organization_license.entity';
import { LicenseCategory } from '../../../common/enums/license_category.enum';
import { Vendor } from '../../vendors/entities/vendor.entity';

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
    enum: LicenseCategory,
    default: LicenseCategory.INSTITUTION_LICENSE,
  })
  license_category: LicenseCategory;
  @Column({
    enum: GeneralStatus,
    default: GeneralStatus.ENABLED,
  })
  status: GeneralStatus;
  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;
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
