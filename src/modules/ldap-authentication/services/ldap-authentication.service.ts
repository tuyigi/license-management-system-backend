import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthenticationDto } from '../dtos/authentication.dto';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';

// import NextAuth from 'next-auth';
// import Providers from 'next-auth/providers';
import ldap from 'ldapjs';
// import jwt from 'jsonwebtoken';
// import { JWT } from 'next-auth/jwt';

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
        url: `ldap://172.16.21.40:389`,
      });
      await client.bind('bnr\\gtuyishime', `user@sys=2024`);
      console.log('done binding...');
      console.log(client.data);
      const opts: ldap.SearchOptions = {
        filter: `(&(sAMAccountName=gtuyishime))`,
        scope: 'sub',
        attributes: ['dn', 'sn', 'cn', 'sAMAccountName', 'displayName'],
      };
      const results = await client.searchReturnAll(
        'dc=bnr,dc=uat',
        opts,
        // 'cn=lms,ou=Dev,dc=bnr,dc=uat',
      );
      // console.log(results);
      const entries: any[] = [];
      for (const entry of results.entries) {
        entries.push(JSON.parse(entry.toString()));
        console.log('=====');
        console.log(JSON.parse(entry.toString()));
        console.log('=====');
      }
      console.log(entries);
      const user = await this.userRepository.find();
      return new ResponseDataDto(
        entries,
        200,
        'User authenticated successfully',
      );
    } catch (e) {
      console.log(`${e.message}`);
      throw new BadRequestException(`${e.message}`);
    }
  }

  async authenticate(authenticationDto: AuthenticationDto) {
    const { email, password } = authenticationDto;
    const username = email;
    const ldap = require('ldapjs-promise');
    const client = ldap.createClient({
      url: 'ldap://172.16.21.40:389',
    });

    const entries: ldap.SearchEntry[] = [];

    try {
      return new Promise((resolve, reject) => {
        client.bind('lms', 'u$er@$y$=2024', async (error) => {
          if (error) {
            reject('LDAP bound failed');
          } else {
            /*
             Start Search
             */
            // await this.searchUser(client);
            /*
            End search
             */

            const opts: ldap.SearchOptions = {
              filter: `(&(sAMAccountName=${username}))`,
              scope: 'sub',
              attributes: ['dn', 'sn', 'cn', 'sAMAccountName'],
            };

            client.search(
              `cn=${username},ou=Dev,dc=bnr,dc=uat`,
              opts,
              (err, res) => {
                if (err) {
                  reject(`User ${username} LDAP search error`);
                } else {
                  console.log('rrrrressss', res);
                  res.on('searchRequest', (searchRequest) => {
                    console.log('searchRequest: ', searchRequest.messageId);
                  });
                  res.on('searchEntry', (entry) => {
                    console.log(`entry`);
                    console.log(`===${entry.dn}`);
                    console.log('entry: ', entry.email);
                    entries.push(entry);
                    client.bind(username, password, (err, res) => {
                      if (err) {
                        console.log('error', err.message);
                        return new ResponseDataDto(
                          null,
                          400,
                          `Connection closed`,
                        );

                        // reject(
                        //   `User ${username} username or password is incorrect`,
                        // );
                      } else {
                        console.log(
                          'LDAP Response:',
                          JSON.parse(res.toString()),
                        );
                        resolve(JSON.parse(res.toString()));
                      }
                    });
                  });
                  res.on('searchReference', (referral) => {
                    console.log('referral: ' + referral.uris.join());
                  });
                  res.on('error', (err) => {
                    reject('LDAP SEARCH error');
                  });
                  res.on('end', (result) => {
                    if (entries.length == 0) {
                      // reject(`User ${username} username or password problem`);
                    }
                  });
                }
              },
            );
          }
        });
      });
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  // async addUserToGroup(groupname) {
  //   const change = new ldap.Change({
  //     operation: 'add',
  //     modification: {
  //       uniqueMember: 'cn=jill,ou=users,ou=system',
  //     },
  //   });
  //
  //   client.modify(groupname, change, function (err) {
  //     if (err) {
  //       console.log('err in add user in a group ' + err);
  //     } else {
  //       console.log('added user in a group');
  //     }
  //   });
  // }

  async searchUser(client) {
    const ldap = require('ldapjs-promise');
    // const client = ldap.createClient({
    //   url: `ldap://172.16.21.40:389`,
    // });

    const username = 'lms';
    // const opts: ldap.SearchOptions = {
    //   filter: `(&(sAMAccountName=${username}))`,
    //   scope: 'base',
    //   attributes: ['cn', 'sAMAccountName'],
    // };

    // const ldap = require('ldapjs');

    // Assuming your LDAP search result is stored in 'ldapResult'
    const ldapResult = {
      // your LDAP search result object
    };

    // Create an LDAP client
    // const client = ldap.createClient({
    //   url: 'ldap://your-ldap-server-url',
    // });

    // Your LDAP search query parameters
    const opts = {
      filter: '(objectClass=user)', // filter to search for user objects
      // filter: '(&(objectClass=user)(|(cn=*)(sAMAccountName=*lms*)))',
      scope: 'sub', // search the entire subtree
    };

    // Perform LDAP search
    client.search('dc=bnr,dc=uat', opts, (err, res) => {
      if (err) {
        console.error('Error during LDAP search:', err);
        return;
      }

      // Handle search result entries
      res.on('searchEntry', (entry) => {
        // Check if the entry has sAMAccountName attribute
        const sAMAccountNameAttr = entry.attributes.find(
          (attr) => attr.type === 'sAMAccountName',
        );

        if (
          sAMAccountNameAttr &&
          sAMAccountNameAttr.values.some((value) => value.includes('lms'))
        ) {
          // If sAMAccountName contains 'lms', log the entry
          console.log('Entry with sAMAccountName containing "lms":');
        }
        // else {
        //   console.log('not found');
        // }
      });

      // Handle search result errors
      res.on('error', (err) => {
        console.error('LDAP search error:', err.message);
      });

      // Handle search result end
      res.on('end', (result) => {
        console.log('result', result);
        console.log('LDAP search result end.');
        client.unbind(); // Close the LDAP connection
      });
    });
  }
}
