import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { UserType } from '../../../common/enums/user_type.enum';
import { GeneralStatus } from '../../../common/enums/general.enum';
import { Organization } from '../../organizations/entities/organization.entity';
import * as bcrypt from 'bcrypt';
import { Exclude } from '@nestjs/class-transformer';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  first_name: string;
  @Column()
  last_name: string;
  @Column({ unique: true })
  username: string;
  @Column({ unique: true })
  email: string;
  @Column({ length: 10, unique: true })
  phone_number: string;
  @Exclude()
  @Column()
  password: string;
  @Column({ enum: GeneralStatus, default: GeneralStatus.ENABLED })
  status: GeneralStatus;
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role_id: Role;
  @ManyToOne(() => Organization, (organization) => organization.users)
  @JoinColumn({ name: 'organization_id' })
  organization_id: Organization;
  @Column({ enum: UserType })
  user_type: UserType;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
