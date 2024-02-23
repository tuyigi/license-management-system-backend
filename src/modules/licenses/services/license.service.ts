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

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License)
    private readonly licenseRepository: Repository<License>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}

  /*
  Create new license
   */

  async createLicense(
    createLicenceDto: CreateLicenceDto,
  ): Promise<ResponseDataDto> {
    try {
      const { code, name, description } = createLicenceDto;
      let license: License = await this.licenseRepository.findOne({
        where: { code, name },
      });
      if (license)
        throw new ConflictException(
          `License with code: ${code} or name: ${name} already exists`,
        );
      license = new License();
      license.name = name;
      license.code = code;
      license.description = description;
      license.license_category = createLicenceDto.license_category;
      /*
      if its software license category , we add license vendor
      */
      let vendor: Vendor = null;
      if (
        createLicenceDto.license_category === LicenseCategory.SOFTWARE_LICENSE
      ) {
        // check if vendor exists
        vendor = await this.vendorRepository.findOne({
          where: { id: createLicenceDto.vendor_id },
        });
        if (!vendor)
          throw new BadRequestException(
            `vendor with ID ${createLicenceDto.vendor_id} not found`,
          );
        license.vendor = vendor;
      }

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
