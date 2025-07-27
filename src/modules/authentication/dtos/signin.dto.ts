import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SigninDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[\w\\.-]{3,50}$/, {
    message: 'invalid credentials',
  })
  username: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
