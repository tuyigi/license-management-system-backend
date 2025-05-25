import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReminderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Invalid reminder date' })
  reminder_date: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  description: string;
  @ApiProperty()
  @IsNumber({}, { message: 'Invalid user ID' })
  user: number;
}
