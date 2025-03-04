import { Controller, Get, HttpCode, Post, Query, UseGuards } from '@nestjs/common';
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
  @Get('sign-up')
  async signUp(@Query('sAMAccountName') email: string) {
    return this.usersService.create(email);
  }

  /*
  Sign In
   */
  @Public()
  //@UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Get('sign-in')
  async signIn(@Query('sAMAccountName') username: string) {
    return this.authService.signIn(username);
  }
}
