import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { LicenseCategory } from '../../../common/enums/license_category.enum';

export class CreateLicenceDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  code: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsEnum(LicenseCategory)
  license_category: LicenseCategory;
  @IsOptional()
  @IsNumber()
  vendor_id: number;
}
