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

import axios from 'axios';

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
  async signIn(signinDto: SigninDto): Promise<ResponseDataDto> {
    const isAuthenticated = await this.checkDomainUser(
      signinDto.username,
      signinDto.password,
    );
    if (!isAuthenticated) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const username1 = signinDto.username;
    const index = username1.lastIndexOf('\\'); // Find the last index of the backslash character

    let username2: string;
    if (index !== -1) {
      // Extract the substring after the last backslash
      username2 = username1.substring(index + 1);
    } else {
      // If no backslash is found, use the whole string as the username
      username2 = username1;
    }
    const user = await this.validateUser(username2);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
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

  async validateUser(username: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async checkDomainUser(username: string, password: string): Promise<any> {
    const baseUrl = this.configService.get<string>(
      'LDAP_AUTHENTICATE_URL_TEST',
    );
    try {
      const response = await axios.post(baseUrl, { username, password });
      console.log(response.data.authenticated);
      return response.status === 200;
    } catch (error) {
      console.error('LDAP Authentication failed:', error.message);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
