import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SystemToolService } from '../services/system-tool.service';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { SystemToolDto } from '../dtos/system-tool.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { memoryStorage } from 'multer';

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

  /*  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async uploadSystemTool(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDataDto> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<SystemToolDto>(sheet);
    return this.systemToolService.uploadSystemTools(rows); // <-- updated method
  }*/
  @Post('upload')
  async uploadSystemToolJson(
    @Body() data: SystemToolDto[],
  ): Promise<ResponseDataDto> {
    return this.systemToolService.uploadSystemTools(data);
  }
}
