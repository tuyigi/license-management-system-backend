import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MetricDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;
}
