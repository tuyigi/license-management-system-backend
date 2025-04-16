import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemTool } from '../entities/system-tool.entity';
import { Repository } from 'typeorm';
import { SystemToolDto } from '../dtos/system-tool.dto';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { DepartmentEntity } from '../../departments/entities/department.entity';

@Injectable()
export class SystemToolService {
  constructor(
    @InjectRepository(SystemTool)
    private readonly systemToolRepository: Repository<SystemTool>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
  ) {}

  /*
  Add new System / tool
   */
  async addSystemTool(systemToolDto: SystemToolDto): Promise<ResponseDataDto> {
    try {
      const department: DepartmentEntity =
        await this.departmentRepository.findOne({
          where: { id: systemToolDto.department },
        });
      if (!department)
        throw new NotFoundException(
          `Department with ID: ${systemToolDto.department} not found`,
        );
      const systemTool: SystemTool = new SystemTool();
      systemTool.system_tool_name = systemToolDto.name;
      systemTool.description = systemToolDto.description
        ? systemToolDto.description
        : '';
      systemTool.department = department;
      const savedSystemTool = await this.systemToolRepository.save(systemTool);
      return new ResponseDataDto(
        savedSystemTool,
        201,
        `System tool saved successfully`,
      );
    } catch (e) {
      throw e;
    }
  }

  /*
  Update System tool
   */
  async updateSystemTool(
    id: number,
    systemToolDto: SystemToolDto,
  ): Promise<ResponseDataDto> {
    try {
      const department: DepartmentEntity =
        await this.departmentRepository.findOne({
          where: { id: systemToolDto.department },
        });
      if (!department)
        throw new NotFoundException(
          `Department with ID: ${systemToolDto.department} not found`,
        );
      const systemTool: SystemTool = await this.systemToolRepository.findOne({
        where: {
          id,
        },
      });
      if (!systemTool)
        throw new NotFoundException(`System Tool with ID: ${id}`);
      console.log(systemToolDto.name);
      systemTool.system_tool_name = systemToolDto.name;
      systemTool.description = systemToolDto.description;
      systemTool.department = department;
      await this.systemToolRepository.save(systemTool);
      return new ResponseDataDto(
        systemTool,
        200,
        `System tool updated successfully`,
      );
    } catch (e) {
      throw e;
    }
  }

  /*
  Get all system tool
   */
  async getSystemTools(): Promise<ResponseDataDto> {
    try {
      const systemTools: SystemTool[] = await this.systemToolRepository.find();
      return new ResponseDataDto(
        systemTools,
        200,
        `System tool fetched successfully`,
      );
    } catch (e) {
      throw e;
    }
  }

  async getToolDepartment(departmentId: number): Promise<ResponseDataDto> {
    try {
      const systemTools: SystemTool[] = await this.systemToolRepository.find({
        where: { department: { id: departmentId } },
      });
      return new ResponseDataDto(systemTools);
    } catch (e) {
      throw e;
    }
  }

  /*
Upload new System / tool
 */

  async uploadSystemTools(
    systemToolDtos: SystemToolDto[],
  ): Promise<ResponseDataDto> {
    const savedTools = [];
    try {
      for (const dto of systemToolDtos) {
        const department = await this.departmentRepository.findOne({
          where: { id: dto.department },
        });

        if (!department) {
          throw new NotFoundException(
            `Department with ID ${dto.department} not found`,
          );
        }

        const tool = new SystemTool();
        tool.system_tool_name = dto.name;
        tool.description = dto.description || '';
        tool.department = department;

        const saved = await this.systemToolRepository.save(tool);
        savedTools.push(saved);
      }

      return new ResponseDataDto(
        savedTools,
        201,
        `${savedTools.length} system tools saved successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }
}
