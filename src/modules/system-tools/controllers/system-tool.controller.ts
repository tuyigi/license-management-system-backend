import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SystemToolService } from '../services/system-tool.service';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { SystemToolDto } from '../dtos/system-tool.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';

@UseGuards(new JwtAuthGuard())
@Controller('systemTool')
export class SystemToolController {
  constructor(private readonly systemToolService: SystemToolService) {}

  /*
  Add new system tool
   */
  @Post()
  async addNewSystemTool(
    @Body() systemToolDto: SystemToolDto,
  ): Promise<ResponseDataDto> {
    return this.systemToolService.addSystemTool(systemToolDto);
  }

  /*
  update system tool details
   */

  @Put('/:id')
  async updateSystemTool(
    @Param('id') id: number,
    @Body()
    systemToolDto: SystemToolDto,
  ): Promise<ResponseDataDto> {
    return this.systemToolService.updateSystemTool(id, systemToolDto);
  }

  /*
  Get System tools
   */
  @Get()
  async getSystemTools(): Promise<ResponseDataDto> {
    return this.systemToolService.getSystemTools();
  }

  /*
  Get system tool of specific department
   */
  @Get('department/:departmentId')
  async getToolDepartment(
    @Param('departmentId') departmentId: number,
  ): Promise<ResponseDataDto> {
    return this.systemToolService.getToolDepartment(departmentId);
  }
}
