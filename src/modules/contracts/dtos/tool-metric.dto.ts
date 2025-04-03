import { IsOptional } from 'class-validator';

export class AuditMetricDto {
  @IsOptional()
  entitlement: number;
  @IsOptional()
  utilisation: number;
  @IsOptional()
  comment: string;
}
