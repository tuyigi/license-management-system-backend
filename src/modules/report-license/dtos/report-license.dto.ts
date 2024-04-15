import { PaymentStatusEnum } from '../../../common/enums/payment-status.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ReportLicenseDto {
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsString()
  @IsNotEmpty()
  start_date: string;
  @IsNotEmpty()
  @IsString()
  end_date: string;
  @IsString()
  payment_reference: string;
  @IsNumber()
  period_cost: number;
  @IsOptional()
  doc_reference_link: string;
  @IsEnum(PaymentStatusEnum)
  payment_status: PaymentStatusEnum;
  @IsNumber()
  @IsNotEmpty()
  payment_period: number;
  @IsNumber()
  user: number;
}
