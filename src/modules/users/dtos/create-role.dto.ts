import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  description: string;
}
