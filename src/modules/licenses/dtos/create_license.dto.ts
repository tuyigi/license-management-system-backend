import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { LicenseCategory } from '../../../common/enums/license_category.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLicenceDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  code: string;
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsEnum(LicenseCategory)
  license_category: LicenseCategory;
  @IsOptional()
  @ApiProperty()
  @IsNumber()
  vendor_id: number;
}
