import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { RequestUpdateStatus } from '../../../common/dtos/request_update_status.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
@UseGuards(new JwtAuthGuard())
@Controller('role')
@ApiBearerAuth('access-token')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /*
    Create new role
  */
  @Post()
  @ApiBody({ type: CreateRoleDto })
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
  @ApiParam({ name: 'nam', type: String })
  async getRoleByName(@Param('name') name: string): Promise<ResponseDataDto> {
    return this.roleService.getRoleByName(name);
  }

  /*
    Get Role by ID
  */
  @Get('/:id')
  @ApiParam({ name: 'id', type: Number })
  async getRoleById(@Param('id') id: number): Promise<ResponseDataDto> {
    return this.roleService.getRoleById(id);
  }

  /*
    Update role
  */
  @Put('/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CreateRoleDto })
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
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: RequestUpdateStatus })
  async changeRoleStatus(
    @Param('id') id: number,
    @Body() updateStatusDto: RequestUpdateStatus,
  ): Promise<ResponseDataDto> {
    return this.roleService.changeRoleStatus(id, updateStatusDto);
  }

  /*
    Get assigned privileges to a specific role
  */
  @Get('/privileges/:id')
  @ApiParam({ name: 'id', type: Number })
  async getAssignedPrivilege(
    @Param('id') id: number,
  ): Promise<ResponseDataDto> {
    return this.roleService.getAssignedPrivileges(id);
  }
}
