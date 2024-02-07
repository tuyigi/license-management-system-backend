import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ActionType } from '../../../common/enums/action-type.enum';

export class DecisionLicenseRequestDto {
  @IsEnum(ActionType)
  decision: ActionType;
  @IsString()
  @IsOptional()
  reason?: string;
  @IsNumber()
  user_id: number;
}
