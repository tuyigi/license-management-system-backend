import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Functions } from '../entities/functions.entity';
import { Repository } from 'typeorm';
import { SystemFunctions } from '../entities/system-functions.entity';
import { SystemFunctionsDto } from '../dtos/system-functions.dto';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { SystemTool } from '../../system-tools/entities/system-tool.entity';

@Injectable()
export class SystemFunctionsService {
  constructor(
    @InjectRepository(Functions)
    private readonly functionsRepository: Repository<Functions>,
    @InjectRepository(SystemFunctions)
    private readonly systemFunctionsRepository: Repository<SystemFunctions>,
    @InjectRepository(SystemTool)
    private readonly systemToolRepository: Repository<SystemTool>,
  ) {}

  /*
  Create system functionality
   */
  async createSystemFunctions(
    systemFunctionDto: SystemFunctionsDto,
  ): Promise<ResponseDataDto> {
    try {
      const systemFunction: Functions = new Functions();
      systemFunction.name = systemFunctionDto.name;
      systemFunction.description = systemFunctionDto.description;
      const savedFunction = await this.functionsRepository.save(systemFunction);
      return new ResponseDataDto(
        savedFunction,
        201,
        `System function updated successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Update System functionality
   */
  async updateSystemFunctions(
    id: number,
    systemFunctionDto: SystemFunctionsDto,
  ): Promise<ResponseDataDto> {
    try {
      const systemFunction = await this.functionsRepository.findOne({
        where: { id },
      });
      if (!systemFunction)
        throw new NotFoundException(`System Function with ID: ${id} not found`);
      systemFunction.name = systemFunctionDto.name;
      systemFunction.description = systemFunctionDto.description;
      await this.functionsRepository.save(systemFunction);
      return new ResponseDataDto(
        systemFunction,
        200,
        `System Function updated successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get System Functions
   */
  async getSystemFunctions(): Promise<ResponseDataDto> {
    try {
      const systemFunctions = await this.functionsRepository.find({
        order: { created_at: 'DESC' },
      });
      return new ResponseDataDto(systemFunctions);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Assign functions to system / tool
   */
  async assignFunctionToSystem(
    id: number,
    functions: number[],
  ): Promise<ResponseDataDto> {
    try {
      // allow only 5 functions at once
      if (functions.length > 5)
        throw new BadRequestException(
          `Only five functions can be assigned at once`,
        );
      const systemTool = await this.systemToolRepository.findOne({
        where: { id },
      });
      if (!systemTool)
        throw new NotFoundException(`System Tool with ID: ${id} not found`);

      for (const id of functions) {
        // check if it exists
        const functionOne = await this.functionsRepository.findOne({
          where: { id },
        });
        if (!functionOne)
          throw new NotFoundException(`Function with id: ${id} not found`);
        // check if role is not already assigned with the privilege
        let systemFunction = await this.systemFunctionsRepository.findOne({
          where: {
            system: { id: systemTool.id },
            system_function: { id: functionOne.id },
          },
        });
        if (systemFunction)
          throw new ConflictException(
            `Function with ID: ${functionOne.id} is already assigned to system/tool with ID: ${systemTool.id}`,
          );
        // assign function to system/tool
        systemFunction = new SystemFunctions();
        systemFunction.system = systemTool;
        systemFunction.system_function = functionOne;
        await this.systemFunctionsRepository.save(systemFunction);
      }
      return new ResponseDataDto(
        systemTool,
        200,
        'Function(s) assigned to System/Tool successfully',
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Check functions similar to systems/tools
   */
  async checkSimilarFUnctions(functions: number[]): Promise<ResponseDataDto> {
    try {
      if(functions.length === 0) return new ResponseDataDto([]);
      const similarResult = await this.systemFunctionsRepository
        .createQueryBuilder('system_functions')
        .select('system_functions.system_tool', 'system_tool')
        .addSelect('COUNT(system_functions.*)', 'total')
        .addSelect('system_tools.system_tool_name', 'system_tool_name')
        .innerJoin(
          SystemTool,
          'system_tools',
          'system_functions.system_tool = system_tools.id',
        )
        .where('system_functions.system_function IN (:...functions)', {
          functions,
        })
        .groupBy('system_functions.system_tool, system_tools.system_tool_name')
        .getRawMany();
      return new ResponseDataDto(similarResult);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }
}
