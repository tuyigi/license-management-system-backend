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

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License)
    private readonly licenseRepository: Repository<License>,
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
    const licenses: License[] = await this.licenseRepository.find();
    return new ResponseDataDto(
      licenses,
      200,
      `Licenses retrieved successfully`,
    );
  }
}
