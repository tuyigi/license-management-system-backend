import { Module } from '@nestjs/common';
import { LdapAuthenticationService } from './services/ldap-authentication.service';
import { LdapAuthenticationController } from './controllers/ldap-authentication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [LdapAuthenticationController],
  providers: [LdapAuthenticationService],
})
export class LdapAuthenticationModule {}
