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

@UseGuards(new JwtAuthGuard())
@Controller('license')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  /*
  Create new license
   */
  @Post()
  async createLicense(
    @Body() createLicenseDto: CreateLicenceDto,
  ): Promise<ResponseDataDto> {
    return this.licenseService.createLicense(createLicenseDto);
  }

  /*
  Get all licenses   */

  @Get()
  async getLicenses(): Promise<ResponseDataDto> {
    return this.licenseService.getLicenses();
  }

  /*
  Get One License
   */

  @Get('/:id')
  async getOneLicense(@Param('id') id: number): Promise<ResponseDataDto> {
    return this.licenseService.getOneLicense(id);
  }

  /*
  Update License 
   */

  @Put('/:id')
  async updateLicense(
    @Param('id') id: number,
    @Body() updateLicenseDto: CreateLicenceDto,
  ) {
    return this.licenseService.updateLicense(id, updateLicenseDto);
  }
}
