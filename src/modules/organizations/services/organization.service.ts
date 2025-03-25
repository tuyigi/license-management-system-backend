import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from '../entities/organization.entity';
import { Repository } from 'typeorm';
import { RegisterOrganizationDto } from '../dtos/register_organization.dto';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { UpdateOrganizationDto } from '../dtos/update_organization.dto';
import { RequestUpdateStatus } from '../../../common/dtos/request_update_status.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  /*
  Create New Organization
   */

  async registerOrganization(
    registerOrganizationDto: RegisterOrganizationDto,
  ): Promise<ResponseDataDto> {
    try {
      const {
        name,
        tin,
        province,
        representative_name,
        representative_phone_number,
        organization_type,
      } = registerOrganizationDto;
      let organization: Organization =
        await this.organizationRepository.findOne({
          where: { tin: tin },
        });
      if (organization)
        throw new ConflictException(
          `Organization with tin: ${tin} already exists`,
        );
      organization = new Organization();
      organization.tin = tin;
      organization.organization_type = organization_type;
      organization.name = name;
      organization.province = province;
      organization.representative_name = representative_name;
      organization.representative_phone_number = representative_phone_number;
      const savedOrganization =
        await this.organizationRepository.save(organization);
      return new ResponseDataDto(
        savedOrganization,
        201,
        `Organization saved successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Update existing organization
   */

  async updateOrganization(
    id: number,
    organizationDto: UpdateOrganizationDto,
  ): Promise<ResponseDataDto> {
    const { name, province, representative_name, representative_phone_number } =
      organizationDto;
    // check if organization  exists
    const organization: Organization =
      await this.organizationRepository.findOne({ where: { id } });
    if (!organization)
      throw new NotFoundException(`Organization with id : ${id}`);
    organization.name = name;
    organization.province = province;
    organization.representative_name = representative_name;
    organization.representative_phone_number = representative_phone_number;
    await this.organizationRepository.save(organization);
    return new ResponseDataDto(
      organization,
      200,
      `organization updated successfully`,
    );
  }

  /*
  Disable / Enable organization
   */

  async changeOrganizationStatus(
    id: number,
    requestUpdateStatus: RequestUpdateStatus,
  ) {
    /* 
    get existing organization 
     */
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });
    if (!organization)
      throw new NotFoundException(` Organization with ${id} doesn't exists`);
    if (organization.status == requestUpdateStatus.status)
      throw new BadRequestException(
        `Organization is already ${organization.status}`,
      );
    organization.status = requestUpdateStatus.status;
    await this.organizationRepository.save(organization);
    return new ResponseDataDto(
      organization,
      200,
      `Organization status has been changed`,
    );
  }

  /*
  Get One Organization
   */

  async getOneOrganization(id: number) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });
    if (!organization)
      throw new NotFoundException(`Organization with ${id} not found`);
    return new ResponseDataDto(
      organization,
      200,
      `Organization retrieved successfully`,
    );
  }

  /*
  Get and Filter Organization
   */
  async getOrganizations() {
    const organizations: Organization[] =
      await this.organizationRepository.find();
    return new ResponseDataDto(
      organizations,
      200,
      `Organization retrieved successfully`,
    );
  }
}
