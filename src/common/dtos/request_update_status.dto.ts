import { IsEnum } from 'class-validator';
import { GeneralStatus } from '../enums/general.enum';

export class RequestUpdateStatus {
  @IsEnum(GeneralStatus)
  status: GeneralStatus;
}
