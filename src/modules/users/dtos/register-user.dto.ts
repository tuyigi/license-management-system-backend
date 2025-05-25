import { UserType } from '../../../common/enums/user_type.enum';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @Optional()
  @IsString()
  @ApiProperty()
  first_name: string;
  @Optional()
  @ApiProperty()
  @IsString()
  last_name: string;
  @Optional()
  @ApiProperty()
  @IsString()
  username: string;
  @Optional()
  @ApiProperty()
  @IsString()
  password: string;
  @IsEmail()
  @ApiProperty()
  @IsString()
  email: string;
  @Optional()
  @ApiProperty()
  @IsString()
  phone_number: string;
  @IsNumber()
  @ApiProperty()
  role_id: number;
  @IsNumber()
  @ApiProperty()
  organization_id: number;
  @IsEnum(UserType)
  @ApiProperty()
  user_type: UserType;
  @IsOptional()
  @ApiProperty()
  @IsNumber()
  department_id: number;
}
