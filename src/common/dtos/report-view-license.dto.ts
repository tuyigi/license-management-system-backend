import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReportViewLicenseDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
