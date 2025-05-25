import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { CertificatesService } from '../services/certificates.service';
import { CertificateDto } from '../dtos/certificate.dto';
import { CertificateReportDto } from '../dtos/certificate-report.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { CertificateEntity } from '../entities/certificate.entity';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('certificate')
@Controller('certificate')
@ApiBearerAuth('access-token')
export class CertificatesController {
  constructor(private readonly certificateService: CertificatesService) {}

  @Post()
  @ApiBody({ type: CertificateDto })
  async addCertificate(
    @Body() certificateDto: CertificateDto,
  ): Promise<ResponseDataDto> {
    return this.certificateService.addCertificate(certificateDto);
  }

  @Get()
  async getCertificates(): Promise<ResponseDataDto> {
    return this.certificateService.getCertificates();
  }

  @Get('department/:id')
  @ApiParam({ name: 'id', type: Number })
  async getDepartmentCertificates(
    @Param('id') id: number,
  ): Promise<ResponseDataDto> {
    return this.certificateService.getCertificateDepartment(id);
  }

  @Put('/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CertificateDto })
  async updateCertificate(
    @Param('id') id: number,
    @Body() certificateDto: CertificateDto,
  ): Promise<ResponseDataDto> {
    return this.certificateService.updateCertificate(id, certificateDto);
  }

  @Post('report')
  @ApiBody({ type: CertificateReportDto })
  async reportCertificate(
    @Body() certificateReportDto: CertificateReportDto,
  ): Promise<ResponseDataDto> {
    return this.certificateService.reportCertificate(certificateReportDto);
  }

  @Get('report/certificate/:id')
  @ApiParam({ name: 'id', type: Number })
  async getReportedCertificateByCertificate(
    @Param('id') id: number,
  ): Promise<ResponseDataDto> {
    return this.certificateService.getReportCertificateByCertificate(id);
  }

  @Get('report')
  async getReportedCertificates(): Promise<ResponseDataDto> {
    return this.certificateService.getReportedCertificate();
  }

  @Get('report/user/:id')
  @ApiParam({ name: 'id', type: Number })
  async getReportedCertificateByUser(
    @Param('id') id: number,
  ): Promise<ResponseDataDto> {
    return this.certificateService.getReportedCertificateByUser(id);
  }

  @Post('upload')
  @ApiBody({ type: [CertificateDto] })
  async uploadCertificate(
    @Body() data: CertificateDto[],
  ): Promise<ResponseDataDto> {
    return this.certificateService.uploadCertificate(data);
  }

  @Get('reminders/department/:id')
  @ApiParam({ name: 'id', type: Number })
  async getReminders(
    @Param('id') id: number,
  ): Promise<{ count: number; items: CertificateEntity[] }> {
    return this.certificateService.getReminders(id);
  }
}
