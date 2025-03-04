import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);

  constructor(private authService: AuthService) {
    super({ usernameField: 'username' });
    this.logger.warn('LocalStrategy initialized');
  }

  async validate(username: string): Promise<any> {
    const user = await this.authService.validateUser(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
