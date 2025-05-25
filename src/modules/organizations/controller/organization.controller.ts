import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from '../services/organization.service';
import { RegisterOrganizationDto } from '../dtos/register_organization.dto';
import { UpdateOrganizationDto } from '../dtos/update_organization.dto';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { RequestUpdateStatus } from '../../../common/dtos/request_update_status.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@UseGuards(new JwtAuthGuard())
@Controller('organization')
@ApiBearerAuth('access-token')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  /*
    Create new organization
  */
  @Post()
  @ApiBody({ type: RegisterOrganizationDto })
  async createOrganization(
    @Body() organizationDto: RegisterOrganizationDto,
  ): Promise<ResponseDataDto> {
    return this.organizationService.registerOrganization(organizationDto);
  }

  /*
    Update organization
  */
  @Put('/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateOrganizationDto })
  async updateOrganization(
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @Param('id') id: number,
  ): Promise<ResponseDataDto> {
    return this.organizationService.updateOrganization(
      id,
      updateOrganizationDto,
    );
  }

  /*
    Change Organization Status
  */
  @Put('/status/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: RequestUpdateStatus })
  async changeOrganizationStatus(
    @Param('id') id: number,
    @Body() requestChangeStatus: RequestUpdateStatus,
  ): Promise<ResponseDataDto> {
    return this.organizationService.changeOrganizationStatus(
      id,
      requestChangeStatus,
    );
  }

  /*
    Get one Organization
  */
  @Get('/:id')
  @ApiParam({ name: 'id', type: Number })
  async getOneOrganization(@Param('id') id: number): Promise<ResponseDataDto> {
    return this.organizationService.getOneOrganization(id);
  }

  /*
    Get Organizations
  */
  @Get()
  async getOrganizations(): Promise<ResponseDataDto> {
    return this.organizationService.getOrganizations();
  }
}
