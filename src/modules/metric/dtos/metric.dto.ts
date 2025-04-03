import { IsNotEmpty, IsOptional } from 'class-validator';

export class MetricDto {
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;
  @IsOptional()
  description: string;
}
