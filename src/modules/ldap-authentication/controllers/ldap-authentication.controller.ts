import { Body, Controller, Post } from '@nestjs/common';
import { LdapAuthenticationService } from '../services/ldap-authentication.service';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { AuthenticationDto } from '../dtos/authentication.dto';

@Controller('ldapAuthentication')
export class LdapAuthenticationController {
  constructor(private ldapAuthenticationService: LdapAuthenticationService) {}

  /*
  LDAP Authentication
   */
  @Post()
  async ldapAuthentication(
    @Body() ldapAuthenticationDto: AuthenticationDto,
  ): Promise<ResponseDataDto> {
    return this.ldapAuthenticationService.ldapAuthentication(
      ldapAuthenticationDto,
    );
  }
}
