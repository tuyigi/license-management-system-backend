import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrganizationDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  name: string;
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
}
