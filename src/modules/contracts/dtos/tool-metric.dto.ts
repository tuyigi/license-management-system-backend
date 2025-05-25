import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuditMetricDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  entitlement: number;
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  utilisation: number;
  @IsString()
  @IsOptional()
  @ApiProperty()
  comment: string;
}
