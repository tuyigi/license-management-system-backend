import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RecordVendorDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsOptional()
  website: string;
  @IsOptional()
  description: string;
}
