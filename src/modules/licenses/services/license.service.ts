import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { License } from '../entities/license.entity';
import { Repository } from 'typeorm';
import { CreateLicenceDto } from '../dtos/create_license.dto';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { LicenseCategory } from '../../../common/enums/license_category.enum';
import { SystemTool } from '../../system-tools/entities/system-tool.entity';
import { DepartmentEntity } from '../../departments/entities/department.entity';

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License)
    private readonly licenseRepository: Repository<License>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(SystemTool)
    private readonly systemToolRepository: Repository<SystemTool>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
  ) {}

  /*
  Create new license
   */

  async createLicense(
    createLicenceDto: CreateLicenceDto,
  ): Promise<ResponseDataDto> {
    try {
      const {
        code,
        name,
        description,
        license_fees,
        payment_frequency,
        number_system_users,
        currency,
        start_date,
        end_date,
      } = createLicenceDto;
      let license: License = await this.licenseRepository.findOne({
        where: { code, name },
      });
      if (license)
        throw new ConflictException(
          `License with code: ${code} or name: ${name} already exists`,
        );
      const vendor: Vendor = await this.vendorRepository.findOne({
        where: { id: createLicenceDto.vendor },
      });
      if (!vendor)
        throw new NotFoundException(
          `Vendor with ID: ${createLicenceDto.vendor} doesn't exist`,
        );
      const department: DepartmentEntity =
        await this.departmentRepository.findOne({
          where: {
            id: createLicenceDto.department,
          },
        });
      if (!department)
        throw new NotFoundException(
          `Department with ID: ${createLicenceDto.department} doesn't exist`,
        );
      const system: SystemTool = await this.systemToolRepository.findOne({
        where: { id: createLicenceDto.system_tool },
      });
      if (!system)
        throw new NotFoundException(
          `System Tool with ID: ${createLicenceDto.system_tool}`,
        );
      license = new License();
      license.name = name;
      license.code = code;
      license.description = description;
      license.vendor = vendor;
      license.department_id = department;
      license.system_tool = system;
      license.license_fees = license_fees;
      license.payment_frequency = payment_frequency;
      license.number_system_users = number_system_users;
      license.currency = currency;
      license.start_date = new Date(`${start_date}`);
      license.end_date = new Date(`${end_date}`);
      const savedLicense = await this.licenseRepository.save(license);
      return new ResponseDataDto(
        savedLicense,
        201,
        `License saved successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Update license
   */

  async updateLicense(
    id: number,
    updateLicenseDto: CreateLicenceDto,
  ): Promise<ResponseDataDto> {
    try {
      const { code, name, description } = updateLicenseDto;
      const license: License = await this.licenseRepository.findOne({
        where: { id },
      });
      if (!license)
        throw new NotFoundException(`License with id: ${id} not found`);
      license.name = name;
      license.code = code;
      license.description = description;
      const savedLicense = await this.licenseRepository.save(license);
      return new ResponseDataDto(
        savedLicense,
        201,
        `License updated successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get One License
   */

  async getOneLicense(id: number): Promise<ResponseDataDto> {
    const license: License = await this.licenseRepository.findOne({
      where: { id },
    });
    if (!license)
      throw new NotFoundException(`License with id: ${id} not found`);
    return new ResponseDataDto(license, 200, `License retrieved succcessfully`);
  }

  /*
  Get Licenses 
   */

  async getLicenses(): Promise<ResponseDataDto> {
    const licenses: License[] = await this.licenseRepository.find({
      order: { created_at: 'DESC' },
      relations: { vendor: true },
    });
    return new ResponseDataDto(
      licenses,
      200,
      `Licenses retrieved successfully`,
    );
  }
}
