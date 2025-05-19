import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DepartmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsOptional()
  description: string;
  @IsOptional()
  department_email: string;
}
