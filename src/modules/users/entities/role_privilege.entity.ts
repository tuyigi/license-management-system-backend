import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Privilege } from './privilege.entity';

@Entity('role_privileges')
export class RolePrivilege extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Role, (role) => role.privileges)
  @JoinColumn({ name: 'role_id' })
  role_id: Role;
  @ManyToOne(() => Privilege)
  @JoinColumn({ name: 'privilege_id' })
  privilege_id: Privilege;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
