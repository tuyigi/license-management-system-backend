import { LicensePeriodEnum } from '../../../common/enums/license-period.enum';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { LicenseRequestType } from '../../../common/enums/license-request-type.enum';

export class RequestLicenseDto {
  @IsNumber()
  @IsNotEmpty()
  license_id: number;
  @IsNumber()
  @IsNotEmpty()
  organization_id: number;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsEnum(LicensePeriodEnum)
  license_period: LicensePeriodEnum;
  @IsNotEmpty({ message: 'License period count is not defined' })
  @IsNumber()
  license_period_count: number;
  @IsNumber()
  @IsNotEmpty()
  requested_by: number;
  @IsEnum(LicenseRequestType)
  request_type: LicenseRequestType;
}
