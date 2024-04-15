import { IsNotEmpty, IsString } from 'class-validator';

export class ApprovalStatusDto {
  @IsNotEmpty()
  @IsString()
  status: string;
}
