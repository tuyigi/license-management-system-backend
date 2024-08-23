import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  old_password: string;
  @IsNotEmpty()
  @IsString()
  new_password: string;
}
