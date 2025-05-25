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
import { ApiProperty } from '@nestjs/swagger';

export class ContractDto {
  @IsNumber()
  @ApiProperty()
  vendor: number;
  @IsNumber()
  @ApiProperty()
  department: number;
  @IsArray({ message: 'System tools should be valid' })
  @ApiProperty()
  system_tools: number[];
  @IsOptional()
  @ApiProperty()
  @IsString()
  contract_number: string;
  @IsNumber()
  @ApiProperty()
  annual_license_fees: number;
  @IsString()
  @ApiProperty()
  start_date: string;
  @IsString()
  @ApiProperty()
  end_date: string;
  @Column({ nullable: true })
  reminder: Date;
  @IsOptional()
  @ApiProperty()
  @IsString()
  description: string;
  @IsOptional()
  @ApiProperty()
  @IsString()
  document_link: string;
  @ApiProperty()
  @IsEnum(CurrencyEnum)
  currency: CurrencyEnum;
  @ApiProperty()
  @IsEnum(PaymentFrequencyEnum)
  payment_frequency: PaymentFrequencyEnum;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  number_system_users: number;
}
