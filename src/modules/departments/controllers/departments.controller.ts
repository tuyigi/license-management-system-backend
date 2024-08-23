import { DepartmentsService } from '../services/departments.service';
import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { DepartmentDto } from '../dtos/department.dto';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';

@UseGuards(new JwtAuthGuard())
@Controller('department')
export class DepartmentsController {
  constructor(private readonly departmentService: DepartmentsService) {}

  /*
  create department
   */
  @Post()
  async createDepartment(
    @Body() departmentDto: DepartmentDto,
  ): Promise<ResponseDataDto> {
    return this.departmentService.createDepartment(departmentDto);
  }

  /*
  Update department
   */
  @Put('/:id')
  async updateDepartment(
    @Param('id') id: number,
    departmentDto: DepartmentDto,
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
