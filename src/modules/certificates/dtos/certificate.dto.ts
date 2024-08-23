import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CertificateTypeEnum } from '../enums/certificate-type.enum';

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
  @IsString({ message: 'Please provide valid issue date' })
  issue_date: string;
  @IsString({ message: 'Please provide valid expiration date' })
  expiration_date: string;
  @IsEnum(CertificateTypeEnum, {
    message: 'Please provide valid certificate type',
  })
  certificate_type: CertificateTypeEnum;
}
