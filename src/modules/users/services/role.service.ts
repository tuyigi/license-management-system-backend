import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { RequestUpdateStatus } from '../../../common/dtos/request_update_status.dto';
import { RolePrivilege } from '../entities/role_privilege.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RolePrivilege)
    private readonly rolePrivilegeRepository: Repository<RolePrivilege>,
  ) {}

  /*
  Create Role
   */
  async createRole(createRoleDto: CreateRoleDto): Promise<ResponseDataDto> {
    const { name, description } = createRoleDto;
    // check if role name is not already exist
    let role = await this.roleRepository.findOne({ where: { name } });
    if (role)
      throw new ConflictException(`Role with name: ${name} already exist`);
    role = new Role();
    role.name = name;
    role.description = description;
    const savedRole = await this.roleRepository.save(role);
    return new ResponseDataDto(savedRole, 201, 'Role saved successfully');
  }

  /*
  Get role by name
   */
  async getRoleByName(name: string): Promise<ResponseDataDto> {
    const role: Role = await this.roleRepository.findOne({ where: { name } });
    if (!role)
      throw new NotFoundException(`Role with name: ${name} not found `);
    return new ResponseDataDto(role, 200, `role fetched successfully`);
  }

  /*
   Get role by ID
 */
  async getRoleById(id: number): Promise<ResponseDataDto> {
    const role: Role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role with id: ${id} not found `);
    return new ResponseDataDto(role, 200, `role fetched successfully`);
  }

  /*
  Get All Roles
   */
  async getRoles(): Promise<ResponseDataDto> {
    const roles = await this.roleRepository.find();
    return new ResponseDataDto(roles, 200, 'Roles fetched successfully');
  }

  /*
  Update role 
   */
  async updateRole(
    id: number,
    updateDto: CreateRoleDto,
  ): Promise<ResponseDataDto> {
    const { name, description } = updateDto;
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role with id : ${id} not found`);
    role.name = name;
    role.description = description;
    await this.roleRepository.save(role);
    return new ResponseDataDto(role, 200, 'Role saved successfully');
  }

  /*
  Change role status
   */

  async changeRoleStatus(
    id: number,
    updateStatusDto: RequestUpdateStatus,
  ): Promise<ResponseDataDto> {
    try {
      const { status } = updateStatusDto;
      const role: Role = await this.roleRepository.findOne({ where: { id } });
      if (!role) throw new NotFoundException(`Role with id: ${id} not found`);
      if (role.status === status)
        throw new BadRequestException(`Role is already ${status}`);
      role.status = status;
      await this.roleRepository.save(role);
      return new ResponseDataDto(role, 200, 'Role Status changed successfully');
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get role privileges
   */
  async getAssignedPrivileges(id: number): Promise<ResponseDataDto> {
    const role: Role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role with id: ${id} not found`);
    const privileges = await this.rolePrivilegeRepository.find({
      relations: {
        privilege_id: true,
      },
      where: { role_id: { id: role.id } },
    });
    return new ResponseDataDto(
      privileges,
      200,
      'Role privileges fetched successfully',
    );
  }
}
