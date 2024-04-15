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

@Injectable()
export class SystemToolService {
  constructor(
    @InjectRepository(SystemTool)
    private readonly systemToolRepository: Repository<SystemTool>,
  ) {}

  /*
  Add new System / tool
   */
  async addSystemTool(systemToolDto: SystemToolDto): Promise<ResponseDataDto> {
    try {
      const systemTool: SystemTool = new SystemTool();
      systemTool.system_tool_name = systemToolDto.name;
      systemTool.description = systemToolDto.description
        ? systemToolDto.description
        : '';
      const savedSystemTool = await this.systemToolRepository.save(systemTool);
      return new ResponseDataDto(
        savedSystemTool,
        201,
        `System tool saved successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
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
      await this.systemToolRepository.save(systemTool);
      return new ResponseDataDto(
        systemTool,
        200,
        `System tool updated successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
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
      throw new BadRequestException(`${e.message}`);
    }
  }
}
