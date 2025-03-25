import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { RequestUpdateStatus } from '../../../common/dtos/request_update_status.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
// @UseGuards(new JwtAuthGuard())
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /*
  Create new role
   */
  @Post()
  async createRole(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<ResponseDataDto> {
    return this.roleService.createRole(createRoleDto);
  }

  /*
  Get All roles
   */

  @Get()
  async getRoles(): Promise<ResponseDataDto> {
    return this.roleService.getRoles();
  }

  /*
  Get One role by name
   */

  @Get('/name/:nam')
  async getRoleByName(@Param('name') name: string): Promise<ResponseDataDto> {
    return this.roleService.getRoleByName(name);
  }

  /*
  GEt ROle by ID
   */
  @Get('/:id')
  async getRoleById(@Param('id') id: number): Promise<ResponseDataDto> {
    return this.roleService.getRoleById(id);
  }

  /*
  Update role 
   */

  @Put('/:id')
  async updateRole(
    @Param('id') id: number,
    @Body() updateRoleDto: CreateRoleDto,
  ): Promise<ResponseDataDto> {
    return this.roleService.updateRole(id, updateRoleDto);
  }

  /*
  Change role status
   */
  @Put('/status/:id')
  async changeRoleStatus(
    @Param('id') id: number,
    @Body()
    updateStatusDto: RequestUpdateStatus,
  ): Promise<ResponseDataDto> {
    return this.roleService.changeRoleStatus(id, updateStatusDto);
  }

  /*
  get assigned privilege to a specific role
 */
  @Get('/privileges/:id')
  async getAssignedPrivilege(
    @Param('id') id: number,
  ): Promise<ResponseDataDto> {
    return this.roleService.getAssignedPrivileges(id);
  }
}
