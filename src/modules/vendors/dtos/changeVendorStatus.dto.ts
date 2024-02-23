import { IsEnum } from 'class-validator';
import { GeneralStatus } from '../../../common/enums/general.enum';

export class ChangeVendorStatusDto {
  @IsEnum(GeneralStatus)
  status: GeneralStatus;
}
