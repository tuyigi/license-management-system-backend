import { UserType } from '../../../common/enums/user_type.enum';
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  first_name: string;
  @IsString()
  last_name: string;
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsEmail()
  email: string;
  @IsString()
  @Length(10, 10)
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
