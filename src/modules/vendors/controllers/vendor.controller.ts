import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { VendorService } from '../services/vendor.service';
import { RecordVendorDto } from '../dtos/recordVendor.dto';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { ChangeVendorStatusDto } from '../dtos/changeVendorStatus.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
@UseGuards(new JwtAuthGuard())
@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  /*
  Record vendor
   */
  @Post()
  async recordVendor(
    @Body() recordVendorDto: RecordVendorDto,
  ): Promise<ResponseDataDto> {
    return this.vendorService.recordVendor(recordVendorDto);
  }

  /*
  Get vendors
   */
  @Get()
  async getVendors(): Promise<ResponseDataDto> {
    return this.vendorService.getVendors();
  }

  /*
  Update vendor
   */
  @Put('/:id')
  async updateVendor(
    @Param('id') id: number,
    @Body() recordVendor: RecordVendorDto,
  ): Promise<ResponseDataDto> {
    return this.vendorService.updateVendor(id, recordVendor);
  }

  /* 
  Change vendor status
   */
  @Put('/status/:id')
  async changeVendorStatus(
    @Param('id') id: number,
    @Body() changeVendorStatusDto: ChangeVendorStatusDto,
  ) {
    return this.vendorService.changeVendorStatus(id, changeVendorStatusDto);
  }
}
