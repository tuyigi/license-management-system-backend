import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VendorService } from '../services/vendor.service';
import { RecordVendorDto } from '../dtos/recordVendor.dto';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { ChangeVendorStatusDto } from '../dtos/changeVendorStatus.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import * as XLSX from 'xlsx';
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

  /*
Upload new Vendor
*/
  @Post('upload')
  async uploadVendor(
    @Body() data: RecordVendorDto[],
  ): Promise<ResponseDataDto> {
    return this.vendorService.uploadVendor(data);
  }

  /*  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async uploadSystemTool(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDataDto> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<RecordVendorDto>(sheet);
    return this.vendorService.uploadVendor(rows); // <-- updated method
  }*/
}
