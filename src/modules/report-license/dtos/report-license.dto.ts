import { PaymentStatusEnum } from '../../../common/enums/payment-status.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReportLicenseDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  description: string;
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  start_date: string;
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  end_date: string;
  @IsString()
  @ApiProperty()
  payment_reference: string;
  @IsNumber()
  @ApiProperty()
  period_cost: number;
  @IsOptional()
  @ApiProperty()
  @IsString()
  doc_reference_link: string;
  @IsEnum(PaymentStatusEnum)
  @ApiProperty()
  payment_status: PaymentStatusEnum;
  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  payment_period: number;
  @ApiProperty()
  @IsNumber()
  user: number;
}
