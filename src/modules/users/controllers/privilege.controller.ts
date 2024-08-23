import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PrivilegeService } from '../services/privilege.service';
import { CreatePrivilegeDto } from '../dtos/create-privilege.dto';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';

@UseGuards(new JwtAuthGuard())
@Controller('privilege')
export class PrivilegeController {
  constructor(private readonly privilegeService: PrivilegeService) {}

  /*
  Create new privilege
   */
  @Post()
  async createPrivilege(
    @Body() createPrivilegeDto: CreatePrivilegeDto,
  ): Promise<ResponseDataDto> {
    return this.privilegeService.createPrivilege(createPrivilegeDto);
  }

  /*
  Update privilege
   */

  @Put('/:id')
  async updatePrivilege(
    @Param('id') id: number,
    @Body() updatePrivilegeDto: CreatePrivilegeDto,
  ): Promise<ResponseDataDto> {
    return this.privilegeService.updatePrivilege(id, updatePrivilegeDto);
  }

  /*
  Get Privilege by ID
   */
  @Get('/:id')
  async getPrivilege(@Param('id') id: number): Promise<ResponseDataDto> {
    return this.privilegeService.getPrivilegeById(id);
  }

  /*
  Get privileges 
   */
  @Get()
  async getPrivileges(): Promise<ResponseDataDto> {
    return this.privilegeService.getPrivileges();
  }

  /*
  Assign privilege to role
   */
  @Put('/assign/:id')
  async assignPrivilegeToRole(
    @Param('id') id: number,
    @Body() privileges: number[],
  ): Promise<ResponseDataDto> {
    return this.privilegeService.assignPrivilegeToRole(id, privileges);
  }
}
