import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Privilege } from './entities/privilege.entity';
import { RolePrivilege } from './entities/role_privilege.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { OrganizationLicense } from '../organizations/entities/organization_license.entity';
import { RoleService } from './services/role.service';
import { RoleController } from './controllers/role.controller';
import { UserController } from './controllers/user.controller';
import { PrivilegeService } from './services/privilege.service';
import { PrivilegeController } from './controllers/privilege.controller';
import { DepartmentEntity } from '../departments/entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Privilege,
      RolePrivilege,
      Organization,
      OrganizationLicense,
      DepartmentEntity,
    ]),
  ],
  providers: [UsersService, RoleService, PrivilegeService],
  controllers: [RoleController, UserController, PrivilegeController],
})
export class UsersModule {}
