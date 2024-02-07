import {
  Column,
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
  BaseEntity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GeneralStatus } from '../../../common/enums/general.enum';
import { User } from './user.entity';
import { RolePrivilege } from './role_privilege.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name: string;
  @Column()
  description: string;
  @Column({ enum: GeneralStatus, default: GeneralStatus.ENABLED })
  status: GeneralStatus;
  @OneToMany(() => User, (user) => user.role_id)
  users: User[];
  @OneToMany(() => RolePrivilege, (rolePrivilege) => rolePrivilege.role_id)
  privileges: RolePrivilege[];
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
