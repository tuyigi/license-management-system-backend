import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthenticationDto } from '../dtos/authentication.dto';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LdapAuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /*
  LDAP authentication 
   */
  async ldapAuthentication(
    authenticationDto: AuthenticationDto,
  ): Promise<ResponseDataDto> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const ldap = require('ldapjs-promise');
      const client = ldap.createClient({
        url: `${process.env['LDAP_HOST']}`,
      });
      await client.bind(
        `${process.env['LDAP_DN']}`,
        `${process.env['LDAP_PASSWORD']}`,
      );
      const results = await client.searchReturnAll('base');
      for (const entry of results.entries) {
        console.log(`${entry}`);
      }
      const user = await this.userRepository.find();
      return new ResponseDataDto(user, 200, 'User authenticated successfully');
    } catch (e) {
      console.log(`${e.message}`);
      throw new BadRequestException(`${e.message}`);
    }
  }
}
