import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { Repository } from 'typeorm';
import { Contract } from '../entities/contract.entity';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { ContractDto } from '../dtos/contract.dto';
import { PaymentService } from '../../payments/services/payment.service';
import { SystemTool } from '../../system-tools/entities/system-tool.entity';
import { DepartmentEntity } from '../../departments/entities/department.entity';
import { ApprovalStatusDto } from '../dtos/approvalStatus.dto';
import { ApprovalStatusEnum } from '../../../common/enums/approval-status.enum';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
    private readonly paymentService: PaymentService,
    @InjectRepository(SystemTool)
    private readonly systemToolRepository: Repository<SystemTool>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
  ) {}

  /*
  Record new contract
   */
  async createContract(contractDto: ContractDto): Promise<ResponseDataDto> {
    try {
      const vendor: Vendor = await this.vendorRepository.findOne({
        where: { id: contractDto.vendor },
      });
      if (!vendor)
        throw new NotFoundException(
          `Vendor with ID: ${contractDto.vendor} doesn't exist`,
        );
      const department: DepartmentEntity =
        await this.departmentRepository.findOne({
          where: {
            id: contractDto.department,
          },
        });
      if (!department)
        throw new NotFoundException(
          `Department with ID: ${contractDto.department} doesn't exist`,
        );
      const systemTool: SystemTool = await this.systemToolRepository.findOne({
        where: { id: contractDto.system },
      });
      if (!systemTool)
        throw new NotFoundException(
          `System tool with ID: ${contractDto.system}`,
        );
      if (
        new Date(`${contractDto.start_date}`).getMilliseconds() >
        new Date(`${contractDto.end_date}`).getMilliseconds()
      )
        throw new BadRequestException(
          `End date should be greater than start date`,
        );
      const contract: Contract = new Contract();
      contract.contract_number = contractDto.contract_number;
      console.log(
        `start date: ${new Date(Date.parse(`${contractDto.start_date}`))}`,
      );
      console.log(
        `end date: ${new Date(Date.parse(`${contractDto.end_date}`))}`,
      );
      contract.start_date = new Date(Date.parse(`${contractDto.start_date}`));
      contract.end_date = new Date(Date.parse(`${contractDto.end_date}`));
      contract.annual_license_fees = contractDto.annual_license_fees;
      contract.currency = contractDto.currency;
      contract.system_tool = systemTool;
      contract.vendor = vendor;
      contract.department = department;
      contract.description = contractDto.description;
      contract.document_link = contractDto.document_link;
      contract.number_system_users = contractDto.number_system_users;
      const savedContract = await this.contractRepository.save(contract);
      // generate payment batches of contract
      await this.paymentService.generateBatches(savedContract.id);
      return new ResponseDataDto(
        savedContract,
        201,
        `Contract recorded successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Update contract 
   */

  async updateContract(
    id: number,
    contractDto: ContractDto,
  ): Promise<ResponseDataDto> {
    try {
      const vendor: Vendor = await this.vendorRepository.findOne({
        where: { id: contractDto.vendor },
      });
      if (!vendor)
        throw new NotFoundException(`Vendor with ID: ${id} doesn't exist`);
      const systemTool: SystemTool = await this.systemToolRepository.findOne({
        where: { id: contractDto.system },
      });
      if (!systemTool)
        throw new NotFoundException(
          `System tool with ID: ${contractDto.system}`,
        );
      const department: DepartmentEntity =
        await this.departmentRepository.findOne({
          where: {
            id: contractDto.department,
          },
        });
      if (!department)
        throw new NotFoundException(
          `Department with ID: ${contractDto.department} doesn't exist`,
        );
      const contract: Contract = await this.contractRepository.findOne({
        where: { id },
      });
      if (!contract) {
        throw new NotFoundException(`Contract with ID: ${id} not found`);
      }

      // update contract
      contract.contract_number = contractDto.contract_number;
      contract.document_link = contractDto.document_link;
      contract.currency = contractDto.currency;
      contract.payment_frequency = contractDto.payment_frequency;
      contract.vendor = vendor;
      contract.department = department;
      contract.system_tool = systemTool;
      contract.description = contractDto.description;
      contract.annual_license_fees = contractDto.annual_license_fees;
      await this.contractRepository.save(contract);
      return new ResponseDataDto(
        contract,
        200,
        `Contract updated successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get all contracts 
   */
  async getContracts(): Promise<ResponseDataDto> {
    try {
      const contracts: Contract[] = await this.contractRepository.find({
        relations: {
          vendor: true,
          payments: true,
          system_tool: true,
          department: true,
        },
        order: { created_at: 'DESC' },
      });
      return new ResponseDataDto(
        contracts,
        200,
        `contracts fetched successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Update Approval Status
   */
  async changeApprovalStatus(
    id: number,
    status: ApprovalStatusEnum,
  ): Promise<ResponseDataDto> {
    try {
      const contract: Contract = await this.contractRepository.findOne({
        where: { id },
      });
      if (!contract)
        throw new NotFoundException(`Contract with ID: ${id} not found`);
      contract.approval_status = status;
      await this.contractRepository.save(contract);
      return new ResponseDataDto(
        contract,
        200,
        'Contract status changed successfully',
      );
    } catch (e) {
      throw new BadRequestException(`${e.message()}`);
    }
  }
}
