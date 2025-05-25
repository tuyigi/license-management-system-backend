import { DepartmentsService } from '../services/departments.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DepartmentDto } from '../dtos/department.dto';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@UseGuards(new JwtAuthGuard())
@Controller('department')
@ApiBearerAuth('access-token')
export class DepartmentsController {
  constructor(private readonly departmentService: DepartmentsService) {}

  /*
  create department
   */
  @Post()
  @ApiBody({ type: DepartmentDto })
  async createDepartment(
    @Body() departmentDto: DepartmentDto,
  ): Promise<ResponseDataDto> {
    return this.departmentService.createDepartment(departmentDto);
  }

  /*
  Update department
   */
  @Put('/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: DepartmentDto })
  async updateDepartment(
    @Param('id') id: number,
    @Body() departmentDto: DepartmentDto,
  ): Promise<ResponseDataDto> {
    return this.departmentService.updateDepartment(id, departmentDto);
  }

  /*
  Get Departments
   */
  @Get()
  async getDepartments(): Promise<ResponseDataDto> {
    return this.departmentService.getDepartments();
  }
}
