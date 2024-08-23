import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SystemToolDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber({}, { message: 'Department should be number' })
  @IsNotEmpty({ message: 'Department should not be empty' })
  department: number;
  @IsOptional()
  description: string;
}
