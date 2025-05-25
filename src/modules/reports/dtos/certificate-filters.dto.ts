import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CertificateFilterDto {
  @ApiProperty()
  @IsNumber()
  year?: number;
  @ApiProperty()
  @IsNumber()
  user_id?: number;
}
