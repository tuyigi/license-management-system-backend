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
import { ContractSystemToolMetricEntity } from '../entities/contract-system-tool-metric.entity';
import { ComponentMetricEntity } from '../entities/component-metric.entity';
import { MetricEntity } from '../../metric/entities/metric.entity';
import { AuditMetricDto } from '../dtos/tool-metric.dto';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class ContractService {
  constructor(
    private readonly mailService: MailService,
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
    @InjectRepository(ContractSystemToolMetricEntity)
    private readonly toolMetricRepository: Repository<ContractSystemToolMetricEntity>,
    @InjectRepository(ComponentMetricEntity)
    private readonly componentMetricRepository: Repository<ComponentMetricEntity>,
    @InjectRepository(MetricEntity)
    private readonly metricRepository: Repository<MetricEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentEntityRepository: Repository<DepartmentEntity>,
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
      const contractNumber: Contract = await this.contractRepository.findOne({
        where: { id },
        select: ['contract_number'],
      });
      const contractDepartment: Contract =
        await this.contractRepository.findOne({
          where: { id },
          select: ['department'],
        });
      const contractDepartmentId = contractDepartment?.department?.id;
      const departmentEmail = await this.departmentEntityRepository.findOne({
        where: { id: contractDepartmentId },
        select: ['department_email'],
      });
      if (!contract)
        throw new NotFoundException(`Contract with ID: ${id} not found`);
      contract.approval_status = status;
      contract.approval_comment = approvalDto.comment;
      await this.contractRepository.save(contract);
      const email = departmentEmail?.department_email;
      const contract_no = contractNumber?.contract_number;
      if (status == 'REJECTED') {
        await this.mailService.sendFeedbackEmail(
          email,
          status,
          contract_no,
          approvalDto.comment,
        );
      }
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

      // validate metrics if they are provided
      const metrics: MetricEntity[] = [];
      if (componentDto.metrics.length > 0) {
        let notFoundCount = 0;
        for (const metricId of componentDto.metrics) {
          const metric = await this.metricRepository.findOne({
            where: { id: metricId },
          });
          if (!metric) {
            notFoundCount++;
          } else {
            metrics.push(metric);
          }
        }
        if (notFoundCount > 0)
          throw new BadRequestException('Metric not found');
      }

      component.contract = contract;
      component.description = componentDto.description;
      component.start_date = new Date(`${componentDto.start_date}`);
      component.expiry_date = new Date(`${componentDto.expiry_date}`);
      component.host_server = componentDto.host_server || null;
      component.name = componentDto.name;
      const saved = await this.componentRepository.save(component);

      // save contract metric tool details
      for (const metric of metrics) {
        const toolMetric = new ComponentMetricEntity();
        toolMetric.metric = metric;
        toolMetric.component = saved;
        await this.componentMetricRepository.save(toolMetric);
      }
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

      // validate metrics if they are provided
      const metrics: MetricEntity[] = [];
      if (contractToolDto?.metrics?.length > 0) {
        let notFoundCount = 0;
        for (let i = 0; i < contractToolDto.metrics.length; i++) {
          const metric = await this.metricRepository.findOne({
            where: { id: contractToolDto.metrics[i] },
          });
          if (!metric) {
            notFoundCount++;
          } else {
            metrics.push(metric);
          }
        }
        if (notFoundCount > 0)
          throw new BadRequestException('Metric not found');
      }
      contractTool = new ContractSystemToolEntity();
      contractTool.contract = contract;
      contractTool.system_tool = system;
      contractTool.host_server = contractToolDto.host_server || null;
      contractTool.issue_date = new Date(
        Date.parse(`${contractToolDto.issue_date}`),
      );
      contractTool.expire_date = new Date(
        Date.parse(`${contractToolDto.expire_date}`),
      );
      contractTool.currency = contractToolDto.currency;
      contractTool.price = contractToolDto.price;
      const saved = await this.contractToolRepository.save(contractTool);

      // save contract metric tool details
      for (let i = 0; i < metrics.length; i++) {
        console.log('insert metric');
        const toolMetric = new ContractSystemToolMetricEntity();
        toolMetric.metric = metrics[i];
        toolMetric.contract_system_tool = saved;
        await this.toolMetricRepository.save(toolMetric);
      }

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

      // retrieve contract system tools with metrics
      const rawQuery = `
      SELECT cst.id,cst.price,cst.currency,cst.issue_date,cst.expire_date,cst.created_at,cst.updated_at,
      cstm.id as contract_system_tool_metric_id,cstm.entitlement,cstm.utilisation,cstm.license_gap,cstm.contract_system_tool,
      cstm.metric,cstm.comment,   st.system_tool_name, st.description,st.department,m.name
       FROM contract_system_tools cst
      LEFT JOIN contract_system_tool_metric cstm ON cst.id = cstm.contract_system_tool
      INNER JOIN system_tools st ON cst.system_tool = st.id
      LEFT JOIN metrics m ON cstm.metric = m.id
      WHERE cst.contract = $1`;
      const resultTools = await this.contractToolRepository.query(rawQuery, [
        id,
      ]);
      const rawQueryComponents = `select c.id,c.name,c.description,c.start_date,c.expiry_date,c.created_at,c.updated_at,c.contract,c.host_server, cm.id as component_metric_id, cm.entitlement,cm.utilisation,cm.license_gap,cm.created_at,cm.updated_at,cm.component,cm.metric,cm.comment,m.id as metric_id,m.name as metric_name,m.created_at,m.updated_at  from components c left join component_metric cm on c.id=cm.component left join metrics m on cm.metric=m.id where c.contract= $1`;
      const resultComponents = await this.contractToolRepository.query(
        rawQueryComponents,
        [id],
      );
      const response = {
        ...contract,
        toolsMetrics: resultTools,
        componentMetrics: resultComponents,
      };
      return new ResponseDataDto(response);
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

  /*
  View metric tool
   */
  async getMetricTool(
    contract_system_tool_id: number,
  ): Promise<ResponseDataDto> {
    try {
      const contract_system_tool = await this.contractToolRepository.findOne({
        where: { id: contract_system_tool_id },
      });
      if (!contract_system_tool)
        throw new NotFoundException(
          `Contract System Tool with ${contract_system_tool_id} not found`,
        );
      const metrics = await this.toolMetricRepository.find({
        where: { contract_system_tool: { id: contract_system_tool_id } },
        relations: { metric: true },
      });
      return new ResponseDataDto(metrics);
    } catch (e) {
      throw e;
    }
  }

  /*
  View metric component
   */
  async getMetricComponent(
    contract_component_id: number,
  ): Promise<ResponseDataDto> {
    try {
      const contract_component = await this.componentRepository.findOne({
        where: { id: contract_component_id },
      });
      if (!contract_component)
        throw new NotFoundException(
          `Component with ID: ${contract_component_id} not found`,
        );
      const metric = await this.componentMetricRepository.findOne({
        where: { component: { id: contract_component_id } },
      });
      return new ResponseDataDto(metric);
    } catch (e) {
      throw e;
    }
  }

  /*
  Add Metric Audit Tool
   */
  async addToolMetric(
    id: number,
    toolMetricDto: AuditMetricDto,
  ): Promise<ResponseDataDto> {
    try {
      const contract_system_tool_metric =
        await this.toolMetricRepository.findOne({ where: { id } });
      if (!contract_system_tool_metric)
        throw new NotFoundException(`Metrics for ID ${id} not found`);
      contract_system_tool_metric.entitlement = toolMetricDto.entitlement || 0;
      contract_system_tool_metric.utilisation = toolMetricDto.utilisation || 0;
      contract_system_tool_metric.license_gap =
        contract_system_tool_metric.entitlement -
        contract_system_tool_metric.utilisation;
      contract_system_tool_metric.comment = toolMetricDto.comment;
      await this.toolMetricRepository.save(contract_system_tool_metric);
      return new ResponseDataDto(contract_system_tool_metric);
    } catch (e) {
      throw e;
    }
  }

  /*
  Add Metric Audit Component
   */
  async addComponentMetric(
    id: number,
    componentMetricDto: AuditMetricDto,
  ): Promise<ResponseDataDto> {
    try {
      const component_metric = await this.componentMetricRepository.findOne({
        where: { id },
      });
      if (!component_metric)
        throw new NotFoundException(`Metrics for ID ${id} not found`);
      component_metric.entitlement = componentMetricDto.entitlement || 0;
      component_metric.utilisation = componentMetricDto.utilisation || 0;
      component_metric.comment = componentMetricDto.comment;
      await this.componentMetricRepository.save(component_metric);
      return new ResponseDataDto(component_metric);
    } catch (e) {
      throw e;
    }
  }

  /*
  Uploading License Contracts
  */
  async uploadContract(contractDto: ContractDto[]): Promise<ResponseDataDto> {
    const SavedContractsArray = [];
    try {
      for (const dto of contractDto) {
        const vendor: Vendor = await this.vendorRepository.findOne({
          where: { id: dto.vendor },
        });
        if (!vendor)
          throw new NotFoundException(
            `Vendor with ID: ${dto.vendor} doesn't exist`,
          );
        const department: DepartmentEntity =
          await this.departmentRepository.findOne({
            where: {
              id: dto.department,
            },
          });
        if (!department)
          throw new NotFoundException(
            `Department with ID: ${dto.department} doesn't exist`,
          );

        if (
          new Date(`${dto.start_date}`).getMilliseconds() >
          new Date(`${dto.end_date}`).getMilliseconds()
        )
          throw new BadRequestException(
            `End date should be greater than start date`,
          );
        const contract: Contract = new Contract();
        // Generate Contract Number
        const counter: number = await this.contractRepository.countBy({
          department: { id: dto.department },
          vendor: { id: dto.vendor },
        });
        const contractNumber = `BNR/${dto.department}/${vendor.vendor_name}/${counter}`;
        contract.start_date = new Date(Date.parse(`${dto.start_date}`));
        contract.end_date = new Date(Date.parse(`${dto.end_date}`));
        contract.annual_license_fees = dto.annual_license_fees;
        contract.currency = dto.currency;
        contract.vendor = vendor;
        contract.department = department;
        contract.description = dto.description;
        contract.document_link = dto.document_link;
        contract.number_system_users = dto.number_system_users;
        contract.contract_number = dto.contract_number
          ? dto.contract_number
          : contractNumber;
        const savedContract = await this.contractRepository.save(contract);
        SavedContractsArray.push(savedContract);
        await this.paymentService.generateBatches(savedContract.id);
      }
      return new ResponseDataDto(
        SavedContractsArray,
        201,
        `Contracts uploaded successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }
}
