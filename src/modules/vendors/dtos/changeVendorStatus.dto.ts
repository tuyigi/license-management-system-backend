import { IsEnum } from 'class-validator';
import { GeneralStatus } from '../../../common/enums/general.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeVendorStatusDto {
  @IsEnum(GeneralStatus)
  @ApiProperty()
  status: GeneralStatus;
}
