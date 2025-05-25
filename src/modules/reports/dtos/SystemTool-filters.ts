import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SystemToolFilters {
  @ApiProperty()
  @IsNumber()
  year?: number;
  @ApiProperty()
  @IsNumber()
  department?: number;
}
