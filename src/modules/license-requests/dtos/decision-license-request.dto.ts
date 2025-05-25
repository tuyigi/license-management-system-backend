import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ActionType } from '../../../common/enums/action-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class DecisionLicenseRequestDto {
  @IsEnum(ActionType)
  @ApiProperty()
  decision: ActionType;
  @IsString()
  @ApiProperty()
  @IsOptional()
  reason?: string;
  @IsNumber()
  user_id: number;
}
