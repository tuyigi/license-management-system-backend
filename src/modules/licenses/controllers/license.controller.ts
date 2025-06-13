import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { LicenseService } from '../services/license.service';
import { CreateLicenceDto } from '../dtos/create_license.dto';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { AuditMetricDto } from '../../contracts/dtos/tool-metric.dto';
import { LicenseToolDto } from '../dtos/license_tool.dto';
import { ApprovalStatusEnum } from '../../../common/enums/approval-status.enum';
import { ApprovalDto } from '../../contracts/enums/approval.dto';

@UseGuards(new JwtAuthGuard())
@Controller('license')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  /*
  Create new license
   */
  @Post()
  async createLicense(
    @Body() createLicenseDto: CreateLicenceDto,
  ): Promise<ResponseDataDto> {
    return this.licenseService.createLicense(createLicenseDto);
  }

  /*
  Get all licenses   */

  @Get()
  async getLicenses(): Promise<ResponseDataDto> {
    return this.licenseService.getLicenses();
  }

  /*
  Get One License
   */

  @Get('/:id')
  async getOneLicense(@Param('id') id: number): Promise<ResponseDataDto> {
    return this.licenseService.getOneLicense(id);
  }

  /*
  Update License 
   */

  @Put('/:id')
  async updateLicense(
    @Param('id') id: number,
    @Body() updateLicenseDto: CreateLicenceDto,
  ) {
    return this.licenseService.updateLicense(id, updateLicenseDto);
  }

  /*
  Get Licenses by Department
   */
  @Get(`department/:id`)
  async getLicenseDepartment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDataDto> {
    return this.licenseService.getLicenseDepartment(id);
  }

  /*
Get license details
 */
  @Get('details/:id')
  async getLicenseDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDataDto> {
    return this.licenseService.getLicenseDetails(id);
  }

  /*
Add License metric for tool
 */
  @Put('metric/tool/audit/:id')
  async addAuditMetricTool(
    @Param('id') id: number,
    @Body() toolMetricDto: AuditMetricDto,
  ): Promise<ResponseDataDto> {
    return this.licenseService.addLicenseToolMetric(id, toolMetricDto);
  }

  /*
  Add tool metric
   */
  @Put(`addSystemTool/:licenseId/:systemId`)
  async addMetricToTool(
    @Param('licenseId') licenseId: number,
    @Param('systemId') systemId: number,
    @Body() licenseToolDto: LicenseToolDto,
  ): Promise<ResponseDataDto> {
    return this.licenseService.addSystemTool(
      licenseId,
      systemId,
      licenseToolDto,
    );
  }

  /*
Update Approval Status
 */
  @Put('/approvalStatus/:id/:status')
  async updateApprovalStatus(
    @Param('id') id: number,
    @Param('status') status: ApprovalStatusEnum,
    @Body() approvalDto: ApprovalDto,
  ): Promise<ResponseDataDto> {
    return this.licenseService.changeApprovalStatus(id, status, approvalDto);
  }

  /*
Upload License
 */
  @Post('upload')
  async uploadLicenses(
    @Body() data: CreateLicenceDto[],
  ): Promise<ResponseDataDto> {
    return this.licenseService.uploadLicense(data);
  }
}
