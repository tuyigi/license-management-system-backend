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

export class RegisterUserDto {
  @Optional()
  first_name: string;
  @Optional()
  last_name: string;
  @Optional()
  username: string;
  @Optional()
  password: string;
  @IsEmail()
  email: string;
  @Optional()
  phone_number: string;
  @IsNumber()
  role_id: number;
  @IsNumber()
  organization_id: number;
  @IsEnum(UserType)
  user_type: UserType;
  @IsOptional()
  department_id: number;
}
