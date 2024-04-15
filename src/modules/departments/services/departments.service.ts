import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentEntity } from '../entities/department.entity';
import { Repository } from 'typeorm';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { DepartmentDto } from '../dtos/department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
  ) {}

  /*
  create department
   */
  async createDepartment(
    departmentDto: DepartmentDto,
  ): Promise<ResponseDataDto> {
    try {
      const department = new DepartmentEntity();
      department.name = departmentDto.name;
      department.description = departmentDto.description;
      const saved = await this.departmentRepository.save(department);
      return new ResponseDataDto(
        saved,
        201,
        'Department created successfully!',
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Update department
   */
  async updateDepartment(
    id: number,
    departmentDto: DepartmentDto,
  ): Promise<ResponseDataDto> {
    try {
      const department: DepartmentEntity =
        await this.departmentRepository.findOne({
          where: { id: id },
        });
      department.name = departmentDto.name;
      department.description = departmentDto.description;
      await this.departmentRepository.save(department);
      return new ResponseDataDto(
        department,
        200,
        `Department updated successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get departments
   */
  async getDepartments(): Promise<ResponseDataDto> {
    try {
      const departments = await this.departmentRepository.find();
      return new ResponseDataDto(departments);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }
}
