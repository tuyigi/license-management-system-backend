import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ReportLicenseService } from '../services/report-license.service';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { ReportLicenseDto } from '../dtos/report-license.dto';

@Controller('reportLicense')
export class ReportLicenseController {
  constructor(private readonly reportLicenseService: ReportLicenseService) {}

  /*
  Report License 
   */

  @Post()
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
  Update recorded license
   */
  @Put('/:id')
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
