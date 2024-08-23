import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportLicense } from '../entities/report-license.entity';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { ReportLicenseDto } from '../dtos/report-license.dto';
import { Payment } from '../../payments/entities/payment.entity';
import { PaymentStatusEnum } from '../../../common/enums/payment-status.enum';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class ReportLicenseService {
  constructor(
    @InjectRepository(ReportLicense)
    private readonly reportLicenseRepository: Repository<ReportLicense>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /*
  report license period
   */

  async reportLicense(
    reportLicenseDto: ReportLicenseDto,
  ): Promise<ResponseDataDto> {
    try {
      const paymentPeriod: Payment = await this.paymentRepository.findOne({
        where: {
          id: reportLicenseDto.payment_period,
          payment_status: PaymentStatusEnum.PENDING,
        },
        relations: { contract: { vendor: true, system_tool: true } },
      });
      if (!paymentPeriod)
        throw new NotFoundException(
          `payment period with ID: ${reportLicenseDto.payment_period} has been already paid`,
        );
      const user = await this.userRepository.findOne({
        where: { id: reportLicenseDto.user },
      });
      if (!user)
        throw new NotFoundException(
          `User with ID: ${reportLicenseDto.user} not valid`,
        );
      const reportLicense: ReportLicense = new ReportLicense();
      reportLicense.payment_status = reportLicenseDto.payment_status;
      reportLicense.payment_period = paymentPeriod;
      reportLicense.description = reportLicenseDto.description;
      reportLicense.created_by = user;
      reportLicense.doc_reference_link = reportLicenseDto.doc_reference_link;
      reportLicense.period_cost = reportLicenseDto.period_cost;
      reportLicense.start_date = new Date(
        Date.parse(`${reportLicenseDto.start_date}`),
      );
      reportLicense.end_date = new Date(
        Date.parse(`${reportLicenseDto.end_date}`),
      );
      reportLicense.payment_reference = reportLicenseDto.payment_reference;
      const savedReportLicense: ReportLicense =
        await this.reportLicenseRepository.save(reportLicense);
      savedReportLicense.payment_period = paymentPeriod;
      paymentPeriod.payment_status = reportLicenseDto.payment_status;
      await this.paymentRepository.save(paymentPeriod);
      return new ResponseDataDto(
        savedReportLicense,
        201,
        `License recorded successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get reported license
   */
  async getRecordedLicense(): Promise<ResponseDataDto> {
    try {
      const recordedLicenses: ReportLicense[] =
        await this.reportLicenseRepository.find({
          order: { created_at: 'DESC' },
          relations: {
            payment_period: { contract: { vendor: true, system_tool: true } },
          },
        });
      return new ResponseDataDto(
        recordedLicenses,
        200,
        `Licenses fetched successfully`,
      );
    } catch (e) {}
  }

  /*
   Get reported license by department
 */
  async getRecordedLicenseDepartment(id: number): Promise<ResponseDataDto> {
    try {
      const recordedLicenses: ReportLicense[] =
        await this.reportLicenseRepository.find({
          where: { payment_period: { contract: { department: { id } } } },
          order: { created_at: 'DESC' },
          relations: {
            payment_period: { contract: { vendor: true, system_tool: true } },
          },
        });
      return new ResponseDataDto(
        recordedLicenses,
        200,
        `Licenses fetched successfully`,
      );
    } catch (e) {}
  }

  /*
  update reported licenses
   */
  async updateReportedLicense(
    id,
    reportLicenseDto: ReportLicenseDto,
  ): Promise<ResponseDataDto> {
    try {
      const reportLicense: ReportLicense =
        await this.reportLicenseRepository.findOne({ where: { id } });
      if (!reportLicense)
        throw new NotFoundException(`Report License with ID: ${id} not found`);
      const paymentPeriod: Payment = await this.paymentRepository.findOne({
        where: {
          id: reportLicenseDto.payment_period,
          payment_status: PaymentStatusEnum.PENDING,
        },
        relations: { contract: { vendor: true, system_tool: true } },
      });
      if (!paymentPeriod)
        throw new NotFoundException(
          `payment period with ID: ${reportLicenseDto.payment_period} has been already paid`,
        );
      const user = await this.userRepository.findOne({
        where: { id: reportLicenseDto.user },
      });
      if (!user)
        throw new NotFoundException(
          `User with ID: ${reportLicenseDto.user} not valid`,
        );
      reportLicense.payment_status = reportLicenseDto.payment_status;
      reportLicense.payment_period = paymentPeriod;
      reportLicense.description = reportLicenseDto.description;
      reportLicense.created_by = user;
      reportLicense.doc_reference_link = reportLicenseDto.doc_reference_link;
      reportLicense.period_cost = reportLicenseDto.period_cost;
      reportLicense.start_date = new Date(
        Date.parse(`${reportLicenseDto.start_date}`),
      );
      reportLicense.end_date = new Date(
        Date.parse(`${reportLicenseDto.end_date}`),
      );
      reportLicense.payment_reference = reportLicenseDto.payment_reference;
      const savedReportLicense =
        await this.reportLicenseRepository.save(reportLicense);
      savedReportLicense.payment_period = paymentPeriod;
      return new ResponseDataDto(
        savedReportLicense,
        201,
        `License recorded successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }
}
