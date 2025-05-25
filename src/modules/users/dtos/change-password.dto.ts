import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  old_password: string;
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  new_password: string;
}
