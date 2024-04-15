import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CertificateDto {
  @IsNotEmpty()
  @IsString()
  certificate_name: string;
  @IsNotEmpty()
  @IsNotEmpty()
  user_organization: string;
  @IsOptional()
  description: string;
  @IsNumber()
  department_id: number;
}
