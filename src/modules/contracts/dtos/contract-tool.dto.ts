import { CurrencyEnum } from '../../../common/enums/currency.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContractToolDto {
  @ApiProperty()
  @IsNumber({}, { message: 'Price should be a number' })
  price: number;
  @ApiProperty()
  @IsEnum(CurrencyEnum, { message: 'Please provide valid currency' })
  currency: CurrencyEnum;
  @ApiProperty()
  @IsNotEmpty({ message: 'Please provide valid issue date' })
  issue_date: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'Please provide valid expire date' })
  expire_date: string;
  @ApiProperty()
  @IsOptional()
  metrics: number[];
  @ApiProperty()
  @IsString()
  @IsOptional()
  host_server: string;
}
