import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApprovalStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  status: string;
}
