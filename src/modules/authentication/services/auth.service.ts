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
import { ActiveDirectoryService } from './active-directory.service';
import { GeneralStatus } from '../../../common/enums/general.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);
  private activeDirectory = new ActiveDirectoryService();
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}
  async signIn(signInDto: SigninDto): Promise<ResponseDataDto> {
    // eslint-disable-next-line prefer-const
    let { username: email, password } = signInDto;
    if (email.toLowerCase().includes('bnr\\')) {
      const usernames = email.split('bnr\\');
      email = usernames[1];
    }
    // const user = await this.usersRepository.findOne({
    //   where: [{ email }, { username: email }],
    // });

    const user = await this.validateUser(
      signInDto.username,
      signInDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    //
    // if (user.status !== GeneralStatus.ENABLED) {
    //   throw new UnauthorizedException('Unauthorized user');
    // }
    //
    // const auth = await this.activeDirectory.userAuthentication(
    //   `bnr\\${email}`,
    //   password,
    // );
    // if (auth.status !== 200)
    //   throw new UnauthorizedException(`Unauthorized User`);

    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);

    // const refreshToken = await this.jwtService.signAsync(payload, {
    //   expiresIn: '1d',
    // });

    // const { password: pass, ...result } = user;

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
