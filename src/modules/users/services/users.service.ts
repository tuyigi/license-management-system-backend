import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Organization } from '../../organizations/entities/organization.entity';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { Role } from '../entities/role.entity';
import { DepartmentEntity } from '../../departments/entities/department.entity';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UserType } from '../../../common/enums/user_type.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
    private configService: ConfigService,
  ) {}

  /*

  Validate User with LDAP
  *
  * 
  * */

  async create(email: string): Promise<ResponseDataDto> {
    const baseUrl = this.configService.get<string>(
      'LDAP_VALIDATE_ACCOUNT_URL_TEST',
    );
    const validateAccountUrl = `${baseUrl}?sAMAccountName=${encodeURIComponent(email)}`;

    console.log('Final URL:', validateAccountUrl);
    try {
      const response = await axios.get(validateAccountUrl);
      const { statusCode, message, data } = response.data;
      const { objectName, name, sAMAccountName } = data;
      console.log('Response:', { statusCode, message, data });
      const username = sAMAccountName;
      const parts = objectName.split(',');
      let ou: any;
      for (const part of parts) {
        if (part.startsWith('OU=')) {
          ou = part.substring(3);
          break;
        }
      }
      if (statusCode === 200) {
        let user: User = await this.userRepository.findOne({
          where: [{ username }, { email }],
        });
        if (user)
          throw new ConflictException(
            `User with either ${username}, ${email},already exists`,
          );
        const [first_name, last_name] = name.split(' ');
        user = new User();
        user.username = username;
        user.first_name = first_name;
        user.last_name = last_name;
        user.email = email;
        // user.department = ou;
        user.user_type = UserType.SUPER_ADMIN;
        // user.role_id = 'role';
        // user.organization_id = 1;
        const saveUser = await this.userRepository.save(user);
        return new ResponseDataDto(saveUser, 201, 'User saved successfully');

        /*
        Check role if exists
         */
        /*   const role = await this.roleRepository.findOne({
             where: { id: role_id },
           });*/
        /*
        Check department
         */
        /*      let department = null;
              if (department_id) {
                department = await this.departmentRepository.findOne({
                  where: { id: department_id },
                });
              }*/
      } else if (statusCode === 401) {
        console.error('failed 401');
        return new ResponseDataDto(response.data, 401, message);
      }
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Change password
   */
  /*  async changePassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<ResponseDataDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { username: changePasswordDto.username },
      });
      if (!user)
        throw new NotFoundException(
          `User with username:${changePasswordDto.username} not found`,
        );
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(
        changePasswordDto.new_password,
        salt,
      );
      // check if old password is correct
      if (await user.validatePassword(changePasswordDto.old_password)) {
        // encrpty and change password
        user.password = hashedPassword;
        await this.userRepository.save(user);
        return new ResponseDataDto(
          null,
          200,
          `Password has been changed successfully`,
        );
      }
      throw new BadRequestException(`Incorrect password provided`);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }*/

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  /*
  Get User by Id
   */

  async getOneUser(id: number): Promise<ResponseDataDto> {
    const user: User = await this.userRepository.findOne({
      where: { id },
      relations: { role_id: true },
    });
    if (!user) throw new NotFoundException(`User with id : ${id} not found`);
    return new ResponseDataDto(user, 200, 'User fetched successfully');
  }

  /*
  Get User by Username
   */
  async getUserByUsername(username: string): Promise<ResponseDataDto> {
    const user: User = await this.userRepository.findOne({
      where: { username },
      relations: { role_id: true },
    });
    if (!user)
      throw new NotFoundException(`User with username: ${username} not found`);
    return new ResponseDataDto(user, 200, 'User fetched successfully');
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { username },
      relations: {
        role_id: { privileges: { privilege_id: true } },
        department: true,
      },
    });
  }

  /*
  Get users in a specific organization
   */
  // async getOrganizationUsers(id: number): Promise<ResponseDataDto> {
  //   // check organization
  //   const organization: Organization =
  //     await this.organizationRepository.findOne({ where: { id } });
  //   if (!organization)
  //     throw new NotFoundException(`Organization with ID: ${id} not found`);
  //   const users: User[] = await this.userRepository.find({
  //     where: { organization_id: { id } },
  //   });
  //   return new ResponseDataDto(
  //     users,
  //     200,
  //     'Organization users fetched successfully',
  //   );
  // }

  /*
  Get All Users
   */
  async getUsers(): Promise<ResponseDataDto> {
    const data = await this.userRepository.find({
      relations: { role_id: true },
    });
    return new ResponseDataDto(data, 200, 'Users fetched successfully');
  }
}
