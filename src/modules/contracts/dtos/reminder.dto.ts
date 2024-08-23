import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ReminderDto {
  @IsNotEmpty({ message: 'Invalid reminder date' })
  reminder_date: string;
  @IsOptional()
  description: string;
  @IsNumber({}, { message: 'Invalid user ID' })
  user: number;
}
