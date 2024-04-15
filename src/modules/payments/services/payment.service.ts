import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { PaymentFrequencyEnum } from '../../../common/enums/payment-frequency.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Contract } from '../../contracts/entities/contract.entity';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  /*
  Create payment batches of a contract
   */
  async generateBatches(id: number): Promise<ResponseDataDto> {
    try {
      const contract = await this.contractRepository.findOne({ where: { id } });
      if (!contract)
        throw new NotFoundException(`Contract with ID: ${id} not found`);
      if (contract.payment_frequency === PaymentFrequencyEnum.YEAR) {
        // batches for years
        const years: number =
          contract.end_date.getFullYear() - contract.start_date.getFullYear();
        let counter: number = 1;
        let payment: Payment;
        while (counter <= years) {
          payment = new Payment();
          payment.contract = contract;
          payment.payment_fee = contract.annual_license_fees;
          payment.order_number = counter;
          payment.start_period = new Date(
            contract.start_date.getFullYear() + (counter - 1),
            contract.start_date.getMonth(),
            contract.start_date.getDate() + 1,
          );
          payment.end_period = new Date(
            contract.start_date.getFullYear() + counter,
            contract.start_date.getMonth(),
            contract.start_date.getDate(),
          );
          await this.paymentRepository.save(payment);
          counter++;
        }
        return new ResponseDataDto(
          null,
          200,
          `Batches(${years}) generated successfully`,
        );
      } else if (contract.payment_frequency === PaymentFrequencyEnum.MONTH) {
        // batches for months
        const months: number =
          contract.end_date.getMonth() - contract.start_date.getMonth();
        let counter: number = 1;
        let payment: Payment;
        while (counter <= months) {
          payment = new Payment();
          payment.contract = contract;
          payment.payment_fee = contract.annual_license_fees;
          payment.order_number = counter;
          payment.start_period = new Date(
            contract.start_date.getFullYear(),
            contract.start_date.getMonth() + (counter - 1),
            contract.start_date.getDate(),
          );
          payment.end_period = new Date(
            contract.start_date.getFullYear(),
            contract.start_date.getMonth() + counter,
            contract.start_date.getDate() - 1,
          );
          await this.paymentRepository.save(payment);
          counter++;
        }
        return new ResponseDataDto(
          null,
          200,
          `Batches(${months}) generated successfully`,
        );
      }
      return new ResponseDataDto(null, 200, `Batches generated successfully`);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }
}
