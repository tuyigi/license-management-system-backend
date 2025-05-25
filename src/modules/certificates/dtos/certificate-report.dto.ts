import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CertificateReportDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  certificate_id: number;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  issue_date: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  expiry_date: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  responsible: number;
}
