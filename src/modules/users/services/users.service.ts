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
  ) {}

  async create(registerUserDto: RegisterUserDto): Promise<ResponseDataDto> {
    try {
      const {
        username,
        password,
        last_name,
        first_name,
        phone_number,
        email,
        role_id,
        organization_id,
        user_type,
        department_id,
      } = registerUserDto;

      /*
      Check organization exists
       */
      const organization = await this.organizationRepository.findOne({
        where: {
          id: organization_id,
        },
      });
      if (!organization)
        throw new NotFoundException(
          `Organization with ${organization_id} not found`,
        );
      /*
      Check role if exists
       */
      const role = await this.roleRepository.findOne({
        where: { id: role_id },
      });
      /*
      Check department 
       */
      let department = null;
      if (department_id) {
        department = await this.departmentRepository.findOne({
          where: { id: department_id },
        });
      }

      /*
      validate username
       */
      let user: User = await this.userRepository.findOne({
        where: [{ username }, { email }, { phone_number }],
      });
      if (user)
        throw new ConflictException(
          `User with either ${username}, ${email}, ${phone_number} already exists`,
        );
      if (!role)
        throw new NotFoundException(`Role with id ${role_id} not found`);
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      user = new User();
      user.username = username;
      user.password = hashedPassword;
      user.first_name = first_name;
      user.last_name = last_name;
      user.phone_number = phone_number;
      user.password = hashedPassword;
      user.email = email;
      user.department = department;
      user.user_type = user_type;
      user.role_id = role;
      user.organization_id = organization;
      const saveUser = await this.userRepository.save(user);
      return new ResponseDataDto(saveUser, 201, 'User saved successfully');
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Change password
   */
  async changePassword(
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
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  /*
  Get User by Id
   */

  async getOneUser(id: number): Promise<ResponseDataDto> {
    const user: User = await this.userRepository.findOne({
      where: { id },
      relations: { role_id: true, organization_id: true },
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
      relations: { role_id: true, organization_id: true },
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
        organization_id: true,
        department: true,
      },
    });
  }

  /*
  Get users in a specific organization
   */
  async getOrganizationUsers(id: number): Promise<ResponseDataDto> {
    // check organization
    const organization: Organization =
      await this.organizationRepository.findOne({ where: { id } });
    if (!organization)
      throw new NotFoundException(`Organization with ID: ${id} not found`);
    const users: User[] = await this.userRepository.find({
      where: { organization_id: { id } },
    });
    return new ResponseDataDto(
      users,
      200,
      'Organization users fetched successfully',
    );
  }

  /*
  Get All Users
   */
  async getUsers(): Promise<ResponseDataDto> {
    const data = await this.userRepository.find({
      relations: { role_id: true, organization_id: true },
    });
    return new ResponseDataDto(data, 200, 'Users fetched successfully');
  }
}
