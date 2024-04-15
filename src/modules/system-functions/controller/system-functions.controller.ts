import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { SystemFunctionsService } from '../services/system-functions.service';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { SystemFunctionsDto } from '../dtos/system-functions.dto';

@Controller('systemFunction')
export class SystemFunctionsController {
  constructor(private readonly systemFunctionService: SystemFunctionsService) {}

  /*
  Create System Functions
   */
  @Post()
  async createSystemFunction(
    @Body() systemFunctionDto: SystemFunctionsDto,
  ): Promise<ResponseDataDto> {
    return this.systemFunctionService.createSystemFunctions(systemFunctionDto);
  }

  /*
  Update System Function
   */
  @Put('/:id')
  async updateSystemFunction(
    @Param('id') id: number,
    @Body() systemFunctionDto: SystemFunctionsDto,
  ): Promise<ResponseDataDto> {
    return this.systemFunctionService.updateSystemFunctions(
      id,
      systemFunctionDto,
    );
  }

  /*
  Get System Functions
   */
  @Get()
  async getSystemFunctions(): Promise<ResponseDataDto> {
    return this.systemFunctionService.getSystemFunctions();
  }

  /*
  Assign functions to system / tool
   */

  @Put('/assign/:id')
  async assignSystemTool(
    @Param('id') id: number,
    @Body() functions: number[],
  ): Promise<ResponseDataDto> {
    return this.systemFunctionService.assignFunctionToSystem(id, functions);
  }

  /*
  Check similar functions with system/tool
   */

  @Put('/check/functions')
  async checkSimilarFunctionSystem(
    @Body() functions: number[],
  ): Promise<ResponseDataDto> {
    return this.systemFunctionService.checkSimilarFUnctions(functions);
  }
}
