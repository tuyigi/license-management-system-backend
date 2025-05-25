import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OrganizationType } from '../../../common/enums/organization_type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterOrganizationDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tin: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  province: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  representative_name: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  representative_phone_number: string;
  @ApiProperty()
  @IsEnum(OrganizationType)
  @IsNotEmpty()
  organization_type: OrganizationType;
}
