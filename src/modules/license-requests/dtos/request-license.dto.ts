import { LicensePeriodEnum } from '../../../common/enums/license-period.enum';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { LicenseRequestType } from '../../../common/enums/license-request-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class RequestLicenseDto {
  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  license_id: number;
  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  organization_id: number;
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  description: string;
  @ApiProperty()
  @IsEnum(LicensePeriodEnum)
  license_period: LicensePeriodEnum;
  @ApiProperty()
  @IsNotEmpty({ message: 'License period count is not defined' })
  @IsNumber()
  license_period_count: number;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  requested_by: number;
  @ApiProperty()
  @IsEnum(LicenseRequestType)
  request_type: LicenseRequestType;
}
