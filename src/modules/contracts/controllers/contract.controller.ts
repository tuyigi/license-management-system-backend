import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ContractService } from '../services/contract.service';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { ContractDto } from '../dtos/contract.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { ApprovalStatusEnum } from '../../../common/enums/approval-status.enum';
import { ComponentDto } from '../dtos/component.dto';
import { ContractToolDto } from '../dtos/contract-tool.dto';
import { ReminderDto } from '../dtos/reminder.dto';
import { ApprovalDto } from '../enums/approval.dto';
import { AuditMetricDto } from '../dtos/tool-metric.dto';

@UseGuards(new JwtAuthGuard())
@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  /*
  create new contract
   */
  @Post()
  async createContract(
    @Body() contractDto: ContractDto,
  ): Promise<ResponseDataDto> {
    return this.contractService.createContract(contractDto);
  }

  /*
  Update contract
   */
  @Put('/:id')
  async updateContract(
    @Param('id', ParseIntPipe) id: number,
    @Body() contractDto: ContractDto,
  ): Promise<ResponseDataDto> {
    return this.contractService.updateContract(id, contractDto);
  }

  /*
  Get contracts
   */
  @Get()
  async getContracts(): Promise<ResponseDataDto> {
    return this.contractService.getContracts();
  }
  /*
  Generate payment batches of a contract
   */
  // @Get('payment/:id')
  // async generatePaymentBatches(
  //   @Param('id') id: number,
  // ): Promise<ResponseDataDto> {
  //   return this.contractService.generateBatches(id);
  // }

  /*
  Update Approval Status
   */
  @Put('/approvalStatus/:id/:status')
  async updateApprovalStatus(
    @Param('id') id: number,
    @Param('status') status: ApprovalStatusEnum,
    @Body() approvalDto: ApprovalDto,
  ) {
    const result = await this.contractService.changeApprovalStatus(
      id,
      status,
      approvalDto,
    );
    return { message: 'Contract status changed successfully', data: result };
  }

  /*
  Add Contract Components
   */
  @Post(`component`)
  async createComponent(
    @Body() componentDto: ComponentDto,
  ): Promise<ResponseDataDto> {
    return this.contractService.addComponent(componentDto);
  }

  /*
  Get Contract Components
   */
  @Get(`component/:id`)
  async getContractComponent(
    @Param('id') id: number,
  ): Promise<ResponseDataDto> {
    return this.contractService.getContractComponents(id);
  }

  /*
  Get contract by department
   */

  @Get('department/:id')
  async getContractDepartment(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.contractService.getContractDepartment(id);
  }

  /*
  add system tool to contract
 */
  @Put(`addSystemTool/:contractId/:systemId`)
  async addSystemToContract(
    @Param('contractId') contractId: number,
    @Param('systemId') systemId: number,
    @Body() contractToolDto: ContractToolDto,
  ): Promise<ResponseDataDto> {
    return this.contractService.addSystemTool(
      contractId,
      systemId,
      contractToolDto,
    );
  }

  /*
  remove system tool on contract
  */
  @Put(`removeSystemTool/:contractId/:systemId`)
  async removeSystemOnContract(
    @Param('contractId') contractId: number,
    @Param('systemId') systemId: number,
  ): Promise<ResponseDataDto> {
    return this.contractService.removeSystemTool(contractId, systemId);
  }

  /*
  Get Contract system tool
   */
  @Get('systemTool/:contractId')
  async getContractTools(
    @Param('contractId') contractId: number,
  ): Promise<ResponseDataDto> {
    return this.contractService.getContractSystemTool(contractId);
  }

  /*
  Get contract details
   */
  @Get('/:id')
  async getContractDetails(@Param('id') id: number): Promise<ResponseDataDto> {
    return this.contractService.getContractDetails(id);
  }

  /*
  Add reminder
   */
  @Put('reminder/:id')
  async addReminder(
    @Body() reminderDto: ReminderDto,
    @Param('id') contractId: number,
  ): Promise<ResponseDataDto> {
    return this.contractService.addReminder(reminderDto, contractId);
  }

  /*
  Remove reminder
   */
  @Put('reminder/:id')
  async removeReminder(
    @Param('id') reminderId: number,
  ): Promise<ResponseDataDto> {
    return this.contractService.removeReminder(reminderId);
  }

  /*
  Get tool metric
   */
  @Get('metric/tool/:id')
  async getMetricTool(@Param('id') id: number): Promise<ResponseDataDto> {
    return this.contractService.getMetricTool(id);
  }

  /*
  Get component metric
   */
  @Get('metric/component/:id')
  async getComponentTool(@Param('id') id: number): Promise<ResponseDataDto> {
    return this.contractService.getMetricComponent(id);
  }

  /*
  Add audit metric for tool
   */
  @Put('metric/tool/audit/:id')
  async addAuditMetricTool(
    @Param('id') id: number,
    @Body() toolMetricDto: AuditMetricDto,
  ): Promise<ResponseDataDto> {
    return this.contractService.addToolMetric(id, toolMetricDto);
  }

  /*
  Add audit metric for component
   */
  @Put('metric/component/audit/:id')
  async addAuditMetricComponent(
    @Param('id') id: number,
    @Body() componentMetricDto: AuditMetricDto,
  ): Promise<ResponseDataDto> {
    return this.contractService.addComponentMetric(id, componentMetricDto);
  }

  /*
  Upload Contracts
   */
  @Post('upload')
  async uploadLicenseContract(
    @Body() data: ContractDto[],
  ): Promise<ResponseDataDto> {
    return this.contractService.uploadContract(data);
  }
  /*
  Get All Contracts System Tool Metrics by Department
   */
  @Get('tool/metric/department/:id')
  async getContractSystemToolMetrics(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => new BadRequestException('Invalid numeric ID'),
      }),
    )
    id: number,
  ): Promise<ResponseDataDto> {
    return this.contractService.getContractsToolsDepartment(id);
  }

  /*
   Contracts Expiration Reminders By department
   */
  @Get(`reminders/department/:id`)
  async getContractsRemindersByDepartment(@Param('id') id: number) {
    return this.contractService.getContractsRemindersByDepartment(id);
  }

  /*
  Get all tools expiration by department
   */
  @Get('tool/expiration/:id')
  async getCombinedSystemTools(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDataDto> {
    return this.contractService.getCombinedSystemTools(id);
  }
}
