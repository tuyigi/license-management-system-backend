import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { sendEmailV2 } from '../../../common/utils/communication.utils';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
@UseGuards(new JwtAuthGuard())
@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  /*
  Change Password
   */
  @Put('changePassword')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ResponseDataDto> {
    return this.userService.changePassword(changePasswordDto);
  }

  /*
  Send Email
   */
  @Post('send')
  async sendEmail(): Promise<boolean> {
    return sendEmailV2();
  }

  /*
  Create new organization user
   */
  @Post()
  async createUser(
    @Body() registerDto: RegisterUserDto,
  ): Promise<ResponseDataDto> {
    return this.userService.create(registerDto);
  }

  /*
  Get User by ID
   */
  @Get('/:id')
  async getUserById(@Param('id') id: number): Promise<ResponseDataDto> {
    return this.userService.getOneUser(id);
  }

  /*
  Get user by Username
   */

  @Get('/username/:username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<ResponseDataDto> {
    return this.userService.getUserByUsername(username);
  }

  /*
  Get Organization users by organization ID
   */
  @Get('/organization/:id')
  async getOrganizationUsers(
    @Param('id') id: number,
  ): Promise<ResponseDataDto> {
    return this.userService.getOrganizationUsers(id);
  }

  /*
  Get All Users
   */
  @Get()
  async getUsers(): Promise<ResponseDataDto> {
    return this.userService.getUsers();
  }
}
