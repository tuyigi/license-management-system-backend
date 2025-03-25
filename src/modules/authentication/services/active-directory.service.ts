import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';

import axios from 'axios';

@Injectable()
export class ActiveDirectoryService {
  /*
  Validate username from AD
   */
  async validateUsername(username: string): Promise<ResponseDataDto> {
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${process.env.AD_VALIDATE_USERNAME}?sAMAccountName=${username}`,
        headers: {},
      };
      const {
        data: { data },
        status,
      } = await axios.request(config);
      return new ResponseDataDto(data, status, `success`);
    } catch (e) {
      return new ResponseDataDto(null, 400, `${e.message}`);
    }
  }

  /*
  Authentication
   */
  async userAuthentication(
    username: string,
    password: string,
  ): Promise<ResponseDataDto> {
    try {
      const request = JSON.stringify({
        username,
        password,
      });
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.AD_AUTHENTICATION}`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: request,
      };
      const {
        data: { data },
        status,
      } = await axios.request(config);
      return new ResponseDataDto(data, status, `success`);
    } catch (e) {
      throw new UnauthorizedException(`Unauthorized`);
    }
  }
}
