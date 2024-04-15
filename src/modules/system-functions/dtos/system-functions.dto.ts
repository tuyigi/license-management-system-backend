import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SystemFunctionsDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsOptional()
  description: string;
}
