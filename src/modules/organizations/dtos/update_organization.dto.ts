import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  province: string;
  @IsString()
  @IsNotEmpty()
  representative_name: string;
  @IsString()
  @IsNotEmpty()
  representative_phone_number: string;
}
