import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { LicenseService } from '../services/license.service';
import { CreateLicenceDto } from '../dtos/create_license.dto';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@UseGuards(new JwtAuthGuard())
@Controller('license')
@ApiBearerAuth('access-token')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  /*
  Create new license
  */
  @Post()
  @ApiBody({ type: CreateLicenceDto })
  async createLicense(
    @Body() createLicenseDto: CreateLicenceDto,
  ): Promise<ResponseDataDto> {
    return this.licenseService.createLicense(createLicenseDto);
  }

  /*
  Get all licenses
  */
  @Get()
  async getLicenses(): Promise<ResponseDataDto> {
    return this.licenseService.getLicenses();
  }

  /*
  Get One License
  */
  @Get('/:id')
  @ApiParam({ name: 'id', type: Number })
  async getOneLicense(@Param('id') id: number): Promise<ResponseDataDto> {
    return this.licenseService.getOneLicense(id);
  }

  /*
  Update License
  */
  @Put('/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CreateLicenceDto })
  async updateLicense(
    @Param('id') id: number,
    @Body() updateLicenseDto: CreateLicenceDto,
  ) {
    return this.licenseService.updateLicense(id, updateLicenseDto);
  }
}
