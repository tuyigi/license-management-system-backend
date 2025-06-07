import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../../users/services/users.service';
import { RegisterUserDto } from '../../users/dtos/register-user.dto';
import { SigninDto } from '../dtos/signin.dto';
import { Public } from '../decorators/public.decorator';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtService } from '@nestjs/jwt';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /*
  Public Sign Up
   */
  @Post('sign-up')
  async signUp(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.create(registerUserDto);
  }

  /*
  Sign In
   */
  @Public()
  //@UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('sign-in')
  async signIn(@Body() signinDto: SigninDto) {
    return this.authService.signIn(signinDto);
  }
}
