import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { CertificatesService } from '../services/certificates.service';
import { CertificateDto } from '../dtos/certificate.dto';
import { CertificateReportDto } from '../dtos/certificate-report.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { SystemToolDto } from "../../system-tools/dtos/system-tool.dto";

@UseGuards(new JwtAuthGuard())
@Controller('certificate')
export class CertificatesController {
  constructor(private readonly certificateService: CertificatesService) {}

  /*
  Add Certificate
   */
  @Post()
  async addCertificate(
    @Body() certificateDto: CertificateDto,
  ): Promise<ResponseDataDto> {
    return this.certificateService.addCertificate(certificateDto);
  }

  /*
  Get Certificates
   */
  @Get()
  async getCertificates(): Promise<ResponseDataDto> {
    return this.certificateService.getCertificates();
  }
  /*
  Get department certificates
   */
  @Get('department/:id')
  async getDepartmentCertificates(
    @Param('id') id: number,
  ): Promise<ResponseDataDto> {
    return this.certificateService.getCertificateDepartment(id);
  }

  /*
  update certificate
   */
  @Put('/:id')
  async updateCertificate(
    @Param('id') id: number,
    @Body() certificateDto: CertificateDto,
  ): Promise<ResponseDataDto> {
    return this.certificateService.updateCertificate(id, certificateDto);
  }

  /*
  Report Certificate
   */
  @Post('report')
  async reportCertificate(
    @Body() certificateReportDto: CertificateReportDto,
  ): Promise<ResponseDataDto> {
    return this.certificateService.reportCertificate(certificateReportDto);
  }

  /*
  Get reported certificate by certificate
   */
  @Get('report/certificate/:id')
  async getReportedCertificateByCertificate(
    @Param('id') id: number,
  ): Promise<ResponseDataDto> {
    return this.certificateService.getReportCertificateByCertificate(id);
  }

  /*
  Get Reported Certificates
   */
  @Get('report')
  async getReportedCertificates(): Promise<ResponseDataDto> {
    return this.certificateService.getReportedCertificate();
  }

  /*
  Get reported certificate by user
   */
  @Get('report/user/:id')
  async getReportedCertificateByUser(
    @Param('id') id: number,
  ): Promise<ResponseDataDto> {
    return this.certificateService.getReportedCertificateByUser(id);
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
  async uploadCertificate(
    @Body() data: CertificateDto[],
  ): Promise<ResponseDataDto> {
    return this.certificateService.uploadCertificate(data);
  }
}
