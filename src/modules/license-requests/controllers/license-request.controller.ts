import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LicenseRequestService } from '../services/license-request.service';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { RequestLicenseDto } from '../dtos/request-license.dto';
import { ReportViewLicenseDto } from '../../../common/dtos/report-view-license.dto';
import { DecisionLicenseRequestDto } from '../dtos/decision-license-request.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@UseGuards(new JwtAuthGuard())
@Controller('licenseRequest')
@ApiBearerAuth('access-token')
export class LicenseRequestController {
  constructor(private readonly licenseRequestService: LicenseRequestService) {}

  /*
Request organization license
*/
  @Post()
  @ApiBody({ type: RequestLicenseDto })
  async requestOrganizationLicense(
    @Body() requestLicenseDto: RequestLicenseDto,
  ): Promise<ResponseDataDto> {
    return this.licenseRequestService.requestLisence(requestLicenseDto);
  }

  /*
  Get license requested by specific organization
  */
  @Get('/organization/:id')
  @ApiParam({ name: 'id', type: Number })
  async getOrganizationRequestedLicense(
    @Param('id') id: number,
  ): Promise<ResponseDataDto> {
    return this.licenseRequestService.getOrganizationRequestedLicense(id);
  }

  /*
  Get requested licenses
  */
  @Get()
  async getRequestedLicenses(): Promise<ResponseDataDto> {
    return this.licenseRequestService.getRequestedLicenses();
  }

  /*
  Get one requested license by ID
  */
  @Get('/:id')
  @ApiParam({ name: 'id', type: Number })
  async getOneRequestedLicense(
    @Param('id') id: number,
  ): Promise<ResponseDataDto> {
    return this.licenseRequestService.getOneRequestedLicense(id);
  }

  /*
  Report view of license request (only for super Admin and license manager)
  */
  @Put('reportView/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: ReportViewLicenseDto })
  async reportViewLicenseRequest(
    @Param('id') id: number,
    @Body() reportViewLicenseDto: ReportViewLicenseDto,
  ): Promise<ResponseDataDto> {
    return this.licenseRequestService.reportViewLicenseRequest(
      id,
      reportViewLicenseDto,
    );
  }

  /*
  Approve or reject license request (Only license manager allowed)
  */
  @Put('/decision/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: DecisionLicenseRequestDto })
  async approveOrRejectLicenseRequest(
    @Param('id') id: number,
    @Body() decisionLicenseRequestDto: DecisionLicenseRequestDto,
  ): Promise<ResponseDataDto> {
    return this.licenseRequestService.rejectOrApproveLicenseRequest(
      id,
      decisionLicenseRequestDto,
    );
  }

  /*
  Download organization license
  */
  @Get('/download/:id')
  @ApiParam({ name: 'id', type: Number })
  async downloadOrganizationLicense(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    const file =
      await this.licenseRequestService.downloadOrganizationLicense(id);
    response.contentType('application/pdf');
    response.send(file);
  }

  /*
  Download organization license by Reference
  */
  @Get('/download/reference/:reference')
  @ApiParam({ name: 'reference', type: String })
  async downloadOrganizationLicenseByReference(
    @Param('reference') reference: string,
    @Res() response: Response,
  ) {
    const file =
      await this.licenseRequestService.downloadOrganizationLicenseByReference(
        reference,
      );
    response.contentType('application/pdf');
    response.send(file);
  }
}
