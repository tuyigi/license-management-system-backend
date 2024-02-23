import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from '../entities/vendor.entity';
import { Repository } from 'typeorm';
import { RecordVendorDto } from '../dtos/recordVendor.dto';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { ChangeVendorStatusDto } from '../dtos/changeVendorStatus.dto';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}

  /*
  Record License vendor
   */

  async recordVendor(
    recordVendorDto: RecordVendorDto,
  ): Promise<ResponseDataDto> {
    try {
      let vendor: Vendor = await this.vendorRepository.findOne({
        where: { vendor_name: recordVendorDto.name },
      });
      if (vendor)
        throw new ConflictException(`vendor with ${recordVendorDto.name}`);
      vendor = new Vendor();
      vendor.vendor_name = recordVendorDto.name;
      vendor.vendor_website = recordVendorDto.website;
      vendor.description = recordVendorDto.description;
      const savedVendor: Vendor = await this.vendorRepository.save(vendor);
      return new ResponseDataDto(
        savedVendor,
        201,
        'vendor has been recorded successfully!',
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Disable or enable vendor
   */
  async changeVendorStatus(
    id: number,
    changeVendorStatusDto: ChangeVendorStatusDto,
  ): Promise<ResponseDataDto> {
    try {
      const vendor: Vendor = await this.vendorRepository.findOne({
        where: { id },
      });
      if (!vendor)
        throw new BadRequestException(`Vendor with ID ${id} doesn't exist`);
      vendor.status = changeVendorStatusDto.status;
      await vendor.save();
      return new ResponseDataDto(vendor, 200, `vendor updated successfully`);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Update vendor info
   */
  async updateVendor(
    id: number,
    recordVendorDto: RecordVendorDto,
  ): Promise<ResponseDataDto> {
    try {
      const vendor: Vendor = await this.vendorRepository.findOne({
        where: { id },
      });
      if (!vendor)
        throw new BadRequestException(`Vendor with ID ${id} not found`);
      vendor.vendor_name = recordVendorDto.name;
      vendor.vendor_website = recordVendorDto.website;
      vendor.description = recordVendorDto.description;
      await vendor.save();
      return new ResponseDataDto(vendor, 200, `vendor updated successfully`);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get vendors
   */
  async getVendors(): Promise<ResponseDataDto> {
    const vendors: Vendor[] = await this.vendorRepository.find({
      order: { created_at: 'DESC' },
    });
    return new ResponseDataDto(vendors, 200, `vendors fetched successfully`);
  }
}
