import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SigninDto } from '../dtos/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtRefreshTokenStrategy } from '../strategy/jwt-refresh-token.strategy';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}
  async signIn(signInDto: SigninDto): Promise<ResponseDataDto> {
    const user = await this.validateUser(
      signInDto.username,
      signInDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);
    // const refreshToken = await this.jwtService.signAsync(payload, {
    //   expiresIn: '1d',
    // });

    const responseData: { user: any; access_token: string } = {
      user,
      access_token: accessToken,
    };
    return new ResponseDataDto(
      responseData,
      200,
      'User signed in successfully',
    );
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await user.validatePassword(password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
