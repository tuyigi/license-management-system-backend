import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReportLicenseService } from '../services/report-license.service';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { ReportLicenseDto } from '../dtos/report-license.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@UseGuards(new JwtAuthGuard())
@Controller('reportLicense')
@ApiBearerAuth('access-token')
export class ReportLicenseController {
  constructor(private readonly reportLicenseService: ReportLicenseService) {}

  /*
    Report License
  */
  @Post()
  @ApiBody({ type: ReportLicenseDto })
  async recordLicenseReport(
    @Body() reportLicenseDto: ReportLicenseDto,
  ): Promise<ResponseDataDto> {
    return this.reportLicenseService.reportLicense(reportLicenseDto);
  }

  /*
    Get Report License
  */
  @Get()
  async getRecordedLicenseReport(): Promise<ResponseDataDto> {
    return this.reportLicenseService.getRecordedLicense();
  }

  /*
    Get report license by department
  */
  @Get('department/:id')
  @ApiParam({ name: 'id', type: Number })
  async getRecordedLicenseReportDepartment(
    @Param('id') id: number,
  ): Promise<ResponseDataDto> {
    return this.reportLicenseService.getRecordedLicenseDepartment(id);
  }

  /*
    Update recorded license
  */
  @Put('/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: ReportLicenseDto })
  async updateReportedLicense(
    @Param('id') id: number,
    @Body() reportLicenseDto: ReportLicenseDto,
  ): Promise<ResponseDataDto> {
    return this.reportLicenseService.updateReportedLicense(
      id,
      reportLicenseDto,
    );
  }
}
