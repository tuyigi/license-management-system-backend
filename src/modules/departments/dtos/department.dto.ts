import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DepartmentDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;
  @IsString()
  @ApiProperty()
  @IsOptional()
  department_email: string;
}
