import { CurrencyEnum } from '../../../common/enums/currency.enum';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class ContractToolDto {
  @IsNumber({}, { message: 'Price should be a number' })
  price: number;
  @IsEnum(CurrencyEnum, { message: 'Please provide valid currency' })
  currency: CurrencyEnum;
  @IsNotEmpty({ message: 'Please provide valid issue date' })
  issue_date: string;
  @IsNotEmpty({ message: 'Please provide valid expire date' })
  expire_date: string;
}
