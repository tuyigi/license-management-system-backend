import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrganizationType } from '../../../common/enums/organization_type.enum';
import { GeneralStatus } from '../../../common/enums/general.enum';
import { User } from '../../users/entities/user.entity';
import { OrganizationLicense } from './organization_license.entity';

@Entity('organizations')
export class Organization extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name: string;
  @Column({ unique: true })
  tin: string;
  @Column()
  province: string;
  @Column()
  representative_name: string;
  @Column()
  representative_phone_number: string;
  @Column({ enum: OrganizationType })
  organization_type: OrganizationType;
  @Column({ enum: GeneralStatus, default: GeneralStatus.ENABLED })
  status: GeneralStatus;
  @OneToMany(() => User, (user) => user.organization_id)
  users: User[];
  @OneToMany(
    () => OrganizationLicense,
    (organizationLicense) => organizationLicense.organization_id,
  )
  organization_licenses: OrganizationLicense[];
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
