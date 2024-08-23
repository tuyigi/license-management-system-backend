import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ComponentDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  start_date: string;
  @IsNotEmpty()
  @IsString()
  expiry_date: string;
  @IsOptional()
  description: string;
  @IsNotEmpty()
  @IsNumber()
  contract_id: number;
}
