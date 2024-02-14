import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OrganizationType } from '../../../common/enums/organization_type.enum';

export class RegisterOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  tin: string;
  @IsString()
  @IsNotEmpty()
  province: string;
  @IsString()
  @IsNotEmpty()
  representative_name: string;
  @IsString()
  @IsNotEmpty()
  representative_phone_number: string;
  @IsEnum(OrganizationType)
  @IsNotEmpty()
  organization_type: OrganizationType;
}
