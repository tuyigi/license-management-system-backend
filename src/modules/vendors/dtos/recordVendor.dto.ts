import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecordVendorDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  website: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;
}
