import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SystemToolDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNumber({}, { message: 'Department should be number' })
  @IsNotEmpty({ message: 'Department should not be empty' })
  department: number;
  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;
}
