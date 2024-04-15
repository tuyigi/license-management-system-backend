import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SystemToolDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsOptional()
  description: string;
}
