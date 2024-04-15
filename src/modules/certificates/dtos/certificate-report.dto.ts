import { IsNotEmpty, IsNumber } from 'class-validator';

export class CertificateReportDto {
  @IsNotEmpty()
  @IsNumber()
  certificate_id: number;
  @IsNotEmpty()
  issue_date: string;
  @IsNotEmpty()
  expiry_date: string;
  @IsNotEmpty()
  @IsNumber()
  responsible: number;
}
