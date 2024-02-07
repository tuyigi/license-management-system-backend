import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLicenceDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  code: string;
  @IsNotEmpty()
  @IsString()
  description: string;
}
