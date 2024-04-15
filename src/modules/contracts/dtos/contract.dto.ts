import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CurrencyEnum } from '../../../common/enums/currency.enum';
import { PaymentFrequencyEnum } from '../../../common/enums/payment-frequency.enum';

export class ContractDto {
  @IsNumber()
  vendor: number;
  @IsNumber()
  department: number;
  @IsNumber()
  system: number;
  @IsString()
  contract_number: string;
  @IsNumber()
  annual_license_fees: number;
  @IsString()
  start_date: string;
  @IsString()
  end_date: string;
  @IsOptional()
  @IsString()
  description: string;
  @IsOptional()
  @IsString()
  document_link: string;
  @IsEnum(CurrencyEnum)
  currency: CurrencyEnum;
  @IsEnum(PaymentFrequencyEnum)
  payment_frequency: PaymentFrequencyEnum;
  @IsNumber()
  @IsOptional()
  number_system_users: number;
}
