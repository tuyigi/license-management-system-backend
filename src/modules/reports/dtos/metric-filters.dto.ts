import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class MetricFiltersDto {
  @ApiProperty()
  @IsNumber()
  user_id?: number;
}
