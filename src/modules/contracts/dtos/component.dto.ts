import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ComponentDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  start_date: string;
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  expiry_date: string;
  @IsOptional()
  @ApiProperty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  contract_id: number;
  @IsOptional()
  @IsNumber()
  metrics: number[];
  @IsOptional()
  @ApiProperty()
  @IsString()
  host_server: string;
  @IsOptional()
  @ApiProperty()
  @IsString()
  system_tool_name: string;
}
