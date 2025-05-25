import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CertificateTypeEnum } from '../enums/certificate-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CertificateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  certificate_name: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  user_organization: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;
  @ApiProperty()
  @IsNumber()
  department_id: number;
  @ApiProperty()
  @IsString({ message: 'Please provide valid issue date' })
  issue_date: string;
  @ApiProperty()
  @IsString({ message: 'Please provide valid expiration date' })
  expiration_date: string;
  @ApiProperty()
  @IsEnum(CertificateTypeEnum, {
    message: 'Please provide valid certificate type',
  })
  certificate_type: CertificateTypeEnum;
}
