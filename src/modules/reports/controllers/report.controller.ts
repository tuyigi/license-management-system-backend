import { Controller, Get, Param } from '@nestjs/common';
import { ReportService } from '../services/report.service';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  /*
  Get Organization Type Stats
   */
  @Get('/organizationTypeStats')
  async getOrganizationTypeStatus(): Promise<ResponseDataDto> {
    return this.reportService.getOrganizationTypeStats();
  }

  /*
  Get License Request Status Stats
   */
  @Get('/licenseRequestStatusStats')
  async getLicenseRequestStatusStats(): Promise<ResponseDataDto> {
    return this.reportService.getLicenseRequestStats();
  }

  /*
  Get General Stats
   */
  @Get('/generalStats')
  async getGeneralStats(): Promise<ResponseDataDto> {
    return this.reportService.getGeneralStats();
  }

  /*
  Get License Request Status Stats of a specific organization
 */
  @Get('/licenseRequestStatusStats/:orgId')
  async getLicenseRequestOrganizationStatusStats(@Param('orgId') orgId: number): Promise<ResponseDataDto> {
    return this.reportService.getLicenseRequestOrganizationStats(orgId);
  }
}
