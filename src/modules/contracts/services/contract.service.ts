import {
  BadRequestException,
  ConflictException,
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
import { ApprovalStatusEnum } from '../../../common/enums/approval-status.enum';
import { ComponentEntity } from '../entities/component.entity';
import { ComponentDto } from '../dtos/component.dto';
import { ContractSystemToolEntity } from '../entities/contract-system-tool.entity';
import { ContractToolDto } from '../dtos/contract-tool.dto';
import { ContractReminderEntity } from '../entities/contract-reminder.entity';
import { ReminderDto } from '../dtos/reminder.dto';
import { User } from '../../users/entities/user.entity';
import { ApprovalDto } from '../enums/approval.dto';

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
    @InjectRepository(ComponentEntity)
    private readonly componentRepository: Repository<ComponentEntity>,
    @InjectRepository(ContractSystemToolEntity)
    private readonly contractToolRepository: Repository<ContractSystemToolEntity>,
    @InjectRepository(ContractReminderEntity)
    private readonly contractReminderRepository: Repository<ContractReminderEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

      if (
        new Date(`${contractDto.start_date}`).getMilliseconds() >
        new Date(`${contractDto.end_date}`).getMilliseconds()
      )
        throw new BadRequestException(
          `End date should be greater than start date`,
        );
      const contract: Contract = new Contract();
      // Generate Contract Number
      const counter: number = await this.contractRepository.countBy({
        department: { id: contractDto.department },
        vendor: { id: contractDto.vendor },
      });
      const contractNumber = `BNR/${contractDto.department}/${vendor.vendor_name}/${counter}`;
      contract.start_date = new Date(Date.parse(`${contractDto.start_date}`));
      contract.end_date = new Date(Date.parse(`${contractDto.end_date}`));
      contract.annual_license_fees = contractDto.annual_license_fees;
      contract.currency = contractDto.currency;
      contract.vendor = vendor;
      contract.department = department;
      contract.description = contractDto.description;
      contract.document_link = contractDto.document_link;
      contract.number_system_users = contractDto.number_system_users;
      contract.contract_number = contractDto.contract_number
        ? contractDto.contract_number
        : contractNumber;
      const savedContract = await this.contractRepository.save(contract);

      // start add system to contract
      for (const systemId of contractDto.system_tools) {
        const systemTool: SystemTool = await this.systemToolRepository.findOne({
          where: { id: systemId },
        });
        if (systemTool) {
          const contractTool: ContractSystemToolEntity =
            new ContractSystemToolEntity();
          contractTool.system_tool = systemTool;
          contractTool.contract = savedContract;
          await this.contractToolRepository.save(contractTool);
        }
      }
      // end system to contract

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
  Get Contract by department 
   */
  async getContractDepartment(id: number): Promise<ResponseDataDto> {
    try {
      const contract = await this.contractRepository.findOne({ where: { id } });
      if (!contract)
        throw new NotFoundException(`Contract with ID: ${id} not found`);
      const contracts = await this.contractRepository.find({
        where: { department: { id } },
        relations: {
          vendor: true,
          payments: true,
          system_tool: true,
          department: true,
        },
        order: { created_at: 'DESC' },
      });
      return new ResponseDataDto(contracts);
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
    approvalDto: ApprovalDto,
  ): Promise<ResponseDataDto> {
    try {
      const contract: Contract = await this.contractRepository.findOne({
        where: { id },
      });
      if (!contract)
        throw new NotFoundException(`Contract with ID: ${id} not found`);
      contract.approval_status = status;
      contract.approval_comment = approvalDto.comment;
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

  /*
  Add Component to contract
   */
  async addComponent(componentDto: ComponentDto): Promise<ResponseDataDto> {
    try {
      const component: ComponentEntity = new ComponentEntity();
      // validate contract
      const contract: Contract = await this.contractRepository.findOne({
        where: { id: componentDto.contract_id },
      });
      if (!contract)
        throw new NotFoundException(
          `Contract with ID: ${componentDto.contract_id}`,
        );
      component.contract = contract;
      component.description = componentDto.description;
      component.start_date = new Date(`${componentDto.start_date}`);
      component.expiry_date = new Date(`${componentDto.expiry_date}`);
      component.name = componentDto.name;
      const saved = await this.componentRepository.save(component);
      return new ResponseDataDto(saved, 201, `Component added successfully`);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get component by contract
   */
  async getContractComponents(id: number): Promise<ResponseDataDto> {
    try {
      const contract = await this.contractRepository.findOne({ where: { id } });
      if (!contract)
        throw new NotFoundException(`Contract with ID: ${id} not found`);
      const components: ComponentEntity[] = await this.componentRepository.find(
        { where: { contract: { id } } },
      );
      return new ResponseDataDto(components);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Add System Tool
   */
  async addSystemTool(
    contractId: number,
    systemId: number,
    contractToolDto: ContractToolDto,
  ): Promise<ResponseDataDto> {
    try {
      const contract: Contract = await this.contractRepository.findOne({
        where: { id: contractId },
      });
      if (!contract)
        throw new NotFoundException(
          `Contract with ID: ${contractId} not found`,
        );
      const system: SystemTool = await this.systemToolRepository.findOne({
        where: { id: systemId },
      });
      if (!system)
        throw new NotFoundException(`System Tool with ID: ${systemId}`);
      // check if tool not already assigned
      let contractTool = await this.contractToolRepository.findOne({
        where: { system_tool: { id: systemId }, contract: { id: contractId } },
      });
      if (contractTool)
        throw new ConflictException(`Tool or System already added`);
      // validate timelines
      if (
        new Date(`${contractToolDto.issue_date}`).getMilliseconds() >
        new Date(`${contractToolDto.expire_date}`).getMilliseconds()
      )
        throw new BadRequestException(
          `Expire date should be greater than Issue date`,
        );
      contractTool = new ContractSystemToolEntity();
      contractTool.contract = contract;
      contractTool.system_tool = system;
      contractTool.issue_date = new Date(
        Date.parse(`${contractToolDto.issue_date}`),
      );
      contractTool.expire_date = new Date(
        Date.parse(`${contractToolDto.expire_date}`),
      );
      contractTool.currency = contractToolDto.currency;
      contractTool.price = contractToolDto.price;
      const saved = await this.contractToolRepository.save(contractTool);
      return new ResponseDataDto(saved);
    } catch (e) {
      throw e;
    }
  }

  /*
  Remove System Tool
   */
  async removeSystemTool(
    contractId: number,
    systemId: number,
  ): Promise<ResponseDataDto> {
    try {
      const contract = await this.contractRepository.findOne({
        where: { id: contractId },
      });
      if (!contract)
        throw new NotFoundException(
          `Contract with ID: ${contractId} not found`,
        );
      const system = await this.systemToolRepository.findOne({
        where: { id: systemId },
      });
      if (!system)
        throw new NotFoundException(`System with ID:${systemId} not found`);
      await this.contractToolRepository.delete({
        system_tool: { id: system.id },
        contract: { id: contract.id },
      });
      return new ResponseDataDto(contract);
    } catch (e) {
      throw e;
    }
  }

  /*
 Get Contract system tool
  */
  async getContractSystemTool(contractId: number): Promise<ResponseDataDto> {
    try {
      const contract: Contract = await this.contractRepository.findOne({
        where: { id: contractId },
      });
      if (!contract)
        throw new NotFoundException(`Contract with ID: ${contractId}`);
      const tools = await this.contractToolRepository.find({
        where: { contract: { id: contractId } },
        relations: { system_tool: true, contract: true },
      });
      return new ResponseDataDto(tools);
    } catch (e) {
      throw e;
    }
  }

  /*
  Get Contract details
   */
  async getContractDetails(id: number): Promise<ResponseDataDto> {
    try {
      const contract = await this.contractRepository.findOne({
        where: { id },
        relations: {
          vendor: true,
          payments: true,
          components: true,
          reminders: true,
          tools: { system_tool: true },
        },
      });
      if (!contract)
        throw new NotFoundException(`Contract with ID:${id} not found`);
      return new ResponseDataDto(contract);
    } catch (e) {
      throw e;
    }
  }

  /*
  Add contract reminder
   */
  async addReminder(
    reminderDto: ReminderDto,
    contractId: number,
  ): Promise<ResponseDataDto> {
    try {
      const contract: Contract = await this.contractRepository.findOne({
        where: { id: contractId },
      });
      if (!contract)
        throw new NotFoundException(
          `Contract with ID: ${contractId} not found`,
        );
      const user: User = await this.userRepository.findOne({
        where: { id: reminderDto.user },
      });
      if (!user)
        throw new NotFoundException(`User with ID: ${reminderDto.user}`);
      const contractReminder: ContractReminderEntity =
        new ContractReminderEntity();
      contractReminder.reminder_date = new Date(reminderDto.reminder_date);
      contractReminder.contract = contract;
      contractReminder.user = user;
      contractReminder.description = reminderDto.description;
      const reminder =
        await this.contractReminderRepository.save(contractReminder);
      return new ResponseDataDto(reminder);
    } catch (e) {
      throw e;
    }
  }

  /*
  Remove reminder
   */
  async removeReminder(reminderId: number): Promise<ResponseDataDto> {
    try {
      const reminder: ContractReminderEntity =
        await this.contractReminderRepository.findOne({
          where: { id: reminderId },
        });
      if (!reminder)
        throw new NotFoundException(
          `Reminder with ID: ${reminderId} not found`,
        );
      await this.contractReminderRepository.delete({ id: reminderId });
      return new ResponseDataDto(
        reminder,
        200,
        'Reminder removed successfully',
      );
    } catch (e) {
      throw e;
    }
  }
}
