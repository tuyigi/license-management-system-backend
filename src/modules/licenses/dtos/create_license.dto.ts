import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { LicenseCategory } from '../../../common/enums/license_category.enum';
import { CurrencyEnum } from '../../../common/enums/currency.enum';
import { PaymentFrequencyEnum } from '../../../common/enums/payment-frequency.enum';

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
  @IsOptional()
  @IsNumber()
  vendor: number;
  @IsNumber()
  department: number;
  @IsNumber()
  system_tool: number;
  @IsNumber()
  license_fees: number;
  @IsString()
  start_date: string;
  @IsString()
  end_date: string;
  @IsEnum(CurrencyEnum)
  currency: CurrencyEnum;
  @IsEnum(PaymentFrequencyEnum)
  payment_frequency: PaymentFrequencyEnum;
  @IsNumber()
  @IsOptional()
  number_system_users: number;
}
