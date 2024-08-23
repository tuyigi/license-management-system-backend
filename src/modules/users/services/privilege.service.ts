import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Privilege } from '../entities/privilege.entity';
import { Repository } from 'typeorm';
import { CreatePrivilegeDto } from '../dtos/create-privilege.dto';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { Role } from '../entities/role.entity';
import { RolePrivilege } from '../entities/role_privilege.entity';

@Injectable()
export class PrivilegeService {
  constructor(
    @InjectRepository(Privilege)
    private readonly privilegeRepository: Repository<Privilege>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RolePrivilege)
    private readonly rolePrivilegeRepository: Repository<RolePrivilege>,
  ) {}

  /*
  Create privilege
   */
  async createPrivilege(
    createPrivilegeDto: CreatePrivilegeDto,
  ): Promise<ResponseDataDto> {
    const { name, description } = createPrivilegeDto;
    // check if no other privilege with the same name
    let privilege: Privilege = await this.privilegeRepository.findOne({
      where: { name },
    });
    if (privilege)
      throw new ConflictException(
        `Privilege with name: ${name} already exists`,
      );
    privilege = new Privilege();
    privilege.name = name;
    privilege.description = description;
    const savedPrivilege = await this.privilegeRepository.save(privilege);
    return new ResponseDataDto(
      savedPrivilege,
      201,
      'Privilege saved successfully',
    );
  }

  /*
  update privilege
   */
  async updatePrivilege(
    id: number,
    updateDto: CreatePrivilegeDto,
  ): Promise<ResponseDataDto> {
    try {
      const { name, description } = updateDto;
      const privilege: Privilege = await this.privilegeRepository.findOne({
        where: { id },
      });
      if (!privilege)
        throw new NotFoundException(`Privilege with ID: ${id} not found`);
      privilege.name = name;
      privilege.description = description;
      await this.privilegeRepository.save(privilege);
      return new ResponseDataDto(
        privilege,
        200,
        'Privilege saved successfully',
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get one privilege by ID
   */

  async getPrivilegeById(id: number): Promise<ResponseDataDto> {
    const privilege: Privilege = await this.privilegeRepository.findOne({
      where: { id },
    });
    if (!privilege)
      throw new NotFoundException(`Privilege with id: ${id} not found`);
    return new ResponseDataDto(
      privilege,
      200,
      'Privilege retrieved successfully',
    );
  }

  /*
  Get Privileges
   */
  async getPrivileges(): Promise<ResponseDataDto> {
    const privileges: Privilege[] = await this.privilegeRepository.find();
    return new ResponseDataDto(
      privileges,
      200,
      'Privileges fetched successfully',
    );
  }

  /*
  Assign privileges to role
   */
  async assignPrivilegeToRole(
    roleId: number,
    privileges: number[],
  ): Promise<ResponseDataDto> {
    // allow only 5 privilege at once
    if (privileges.length > 5)
      throw new BadRequestException(
        `Only five privileges can be assigned at once`,
      );
    // check if role exist
    const role: Role = await this.roleRepository.findOne({
      where: { id: roleId },
    });
    if (!role) throw new NotFoundException(`Role with ID: ${roleId} not found`);
    for (const id of privileges) {
      // check if it exists
      const privilege = await this.privilegeRepository.findOne({
        where: { id },
      });
      if (!privilege)
        throw new NotFoundException(`Privilege with id: ${id} not found`);
      // check if role is not already assigned with the privilege
      let rolePrivilege = await this.rolePrivilegeRepository.findOne({
        where: { role_id: { id: role.id }, privilege_id: { id: privilege.id } },
      });
      if (rolePrivilege)
        throw new ConflictException(
          `Privilege with ID: ${privilege.id} is already assigned to role with ID: ${role.id}`,
        );
      // assign privilege to role
      rolePrivilege = new RolePrivilege();
      rolePrivilege.role_id = role;
      rolePrivilege.privilege_id = privilege;
      await this.rolePrivilegeRepository.save(rolePrivilege);
    }
    return new ResponseDataDto(
      role,
      200,
      'Privilege(s) assigned to role successfully',
    );
  }
}
