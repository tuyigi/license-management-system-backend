import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LdapAuthenticationService } from '../services/ldap-authentication.service';
import { AuthenticationDto } from '../dtos/authentication.dto';

@Controller('ldapAuthentication')
export class LdapAuthenticationController {
  constructor(private ldapAuthenticationService: LdapAuthenticationService) {}

  /*
  LDAP Authentication
   */
  @Post()
  @HttpCode(200)
  async ldapAuthentication(
    @Body() ldapAuthenticationDto: AuthenticationDto,
  ): Promise<any> {
    // return this.ldapAuthenticationService.authenticate(ldapAuthenticationDto);
    return this.ldapAuthenticationService.ldapAuthentication(
      ldapAuthenticationDto,
    );
  }
}
