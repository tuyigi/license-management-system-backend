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
import { JwtService } from '@nestjs/jwt';
import { ApiBody } from '@nestjs/swagger';
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
  @ApiBody({ type: RegisterUserDto })
  async signUp(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.create(registerUserDto);
  }

  /*
  Sign In
   */
  @Public()
  @HttpCode(200)
  @Post('sign-in')
  @ApiBody({ type: SigninDto })
  async signIn(@Body() signinDto: SigninDto) {
    return this.authService.signIn(signinDto);
  }
}
