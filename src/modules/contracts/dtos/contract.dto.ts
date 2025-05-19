import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CurrencyEnum } from '../../../common/enums/currency.enum';
import { PaymentFrequencyEnum } from '../../../common/enums/payment-frequency.enum';
import { Column } from 'typeorm';

export class ContractDto {
  @IsNumber()
  vendor: number;
  @IsNumber()
  department: number;
  @IsArray({ message: 'System tools should be valid' })
  system_tools: number[];
  // @IsNumber()
  // system_tools: number;
  @IsOptional()
  contract_number: string;
  @IsNumber()
  annual_license_fees: number;
  @IsString()
  start_date: string;
  @IsString()
  end_date: string;
  @Column({ nullable: true })
  reminder: Date;
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
