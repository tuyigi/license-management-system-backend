import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ReportService } from '../services/report.service';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { CertificateFilterDto } from '../dtos/certificate-filters.dto';
import { ComponentFilters } from '../dtos/component-filters.dto';
import { SystemToolFilters } from '../dtos/SystemTool-filters';
import { MetricFiltersDto } from '../dtos/metric-filters.dto';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';

@UseGuards(new JwtAuthGuard())
@Controller('reports')
@ApiBearerAuth('access-token')
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
  @ApiParam({ name: 'orgId', type: Number })
  async getLicenseRequestOrganizationStatusStats(
    @Param('orgId') orgId: number,
  ): Promise<ResponseDataDto> {
    return this.reportService.getLicenseRequestOrganizationStats(orgId);
  }

  /*
    Get License type stats
  */
  @Get('/licenseTypeStats')
  async getLicenseTypeStats(): Promise<ResponseDataDto> {
    return this.reportService.getApprovedLicenseTypeStats();
  }

  /*
    Get License Report
  */
  @Get('/expires/:year')
  @ApiParam({ name: 'year', type: Number })
  async getLicenseReportWithDayLeft(
    @Param('year') year: number,
  ): Promise<ResponseDataDto> {
    return this.reportService.getLicenseReport(year);
  }

  /*
    Get summary of reported license ( license owner)
  */
  @Get('/recordedLicenseSummary')
  async getRecordedLicenseSummary(): Promise<ResponseDataDto> {
    return this.reportService.getRecordedLicenseSummary();
  }

  /*
    Get total contract per department
  */
  @Get('/totalContractDepartment/:id')
  @ApiParam({ name: 'id', type: Number })
  async getTotalDepartment(@Param('id') id: number): Promise<ResponseDataDto> {
    return this.reportService.getTotalDepartment(id);
  }

  /*
    Get contract period payments summary of specific department
  */
  @Get('/contractPeriodPayments/:id')
  @ApiParam({ name: 'id', type: Number })
  async getContractPeriodPayments(
    @Param('id') id: number,
  ): Promise<ResponseDataDto> {
    return this.reportService.getContractPeriodPayments(id);
  }

  /*
    Get numbers of certificates in specific department
  */
  @Get('/certificatesDepartment/:id')
  @ApiParam({ name: 'id', type: Number })
  async getCertificateNumbers(
    @Param('id') id: number,
  ): Promise<ResponseDataDto> {
    return this.reportService.getCertificateNumbers(id);
  }

  /*
    Get vendors payment numbers summary per specific department
  */
  @Get('/vendorPaymentsDepartment/:id')
  @ApiParam({ name: 'id', type: Number })
  async getVendorPayments(@Param('id') id: number): Promise<ResponseDataDto> {
    return this.reportService.getVendorPayments(id);
  }

  /*
    Get Certificate report
  */
  @Get('/certificate')
  @ApiQuery({ name: 'certificateFilterDto', type: CertificateFilterDto })
  getCertificateReport(
    @Query() certificateFilterDto: CertificateFilterDto,
  ): Promise<ResponseDataDto> {
    return this.reportService.getCertificateReport(certificateFilterDto);
  }

  /*
    Get Component report
  */
  @Get('/components')
  @ApiQuery({ name: 'componentFilters', type: ComponentFilters })
  getComponentReport(
    @Query() componentFilters: ComponentFilters,
  ): Promise<ResponseDataDto> {
    return this.reportService.getComponentsReport(componentFilters);
  }

  /*
    Get System Tool report
  */
  @Get('/systemTool')
  @ApiQuery({ name: 'systemToolFilters', type: SystemToolFilters })
  getSystemToolReport(
    @Query() systemToolFilters: SystemToolFilters,
  ): Promise<ResponseDataDto> {
    return this.reportService.getSystemToolReport(systemToolFilters);
  }

  /*
    Get Certificate Metrics
  */
  @Get('/metrics/certificate')
  @ApiQuery({ name: 'metricFiltersDto', type: MetricFiltersDto })
  getCertificateMetrics(
    @Query() metricFiltersDto: MetricFiltersDto,
  ): Promise<ResponseDataDto> {
    return this.reportService.getCertificateMetrics(metricFiltersDto);
  }

  /*
    Get All Metrics
  */
  @Get('/metrics/all')
  getAllMetrics(): Promise<ResponseDataDto> {
    return this.reportService.getAllMetrics();
  }
}
