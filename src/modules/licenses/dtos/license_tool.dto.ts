import { IsOptional } from 'class-validator';

export class LicenseToolDto {
  @IsOptional()
  metrics: number[];
}
