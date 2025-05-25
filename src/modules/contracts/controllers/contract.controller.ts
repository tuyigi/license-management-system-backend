import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
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
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('contract')
@ApiBearerAuth('access-token')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  @ApiBody({ type: ContractDto })
  async createContract(
    @Body() contractDto: ContractDto,
  ): Promise<ResponseDataDto> {
    return this.contractService.createContract(contractDto);
  }

  /*
  Update contract
   */
  @Put('/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: ContractDto })
  async updateContract(
    @Param('id') id: number,
    @Body() contractDto: ContractDto,
  ): Promise<ResponseDataDto> {
    return this.contractService.updateContract(id, contractDto);
  }

  /*
  Update Approval Status
   */
  @Put('/approvalStatus/:id/:status')
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'status', enum: ApprovalStatusEnum })
  @ApiBody({ type: ApprovalDto })
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
  @Post('component')
  @ApiBody({ type: ComponentDto })
  async createComponent(
    @Body() componentDto: ComponentDto,
  ): Promise<ResponseDataDto> {
    return this.contractService.addComponent(componentDto);
  }

  /*
  Get Contract Components
   */
  @Get('component/:id')
  @ApiParam({ name: 'id', type: Number })
  async getContractComponent(
    @Param('id') id: number,
  ): Promise<ResponseDataDto> {
    return this.contractService.getContractComponents(id);
  }

  /*
  Get contract by department
   */
  @Get('department/:id')
  @ApiParam({ name: 'id', type: Number })
  async getContractDepartment(
    @Param('id') id: number,
  ): Promise<ResponseDataDto> {
    return this.contractService.getContractDepartment(id);
  }

  /*
  add system tool to contract
   */
  @Put('addSystemTool/:contractId/:systemId')
  @ApiParam({ name: 'contractId', type: Number })
  @ApiParam({ name: 'systemId', type: Number })
  @ApiBody({ type: ContractToolDto })
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
  @Put('removeSystemTool/:contractId/:systemId')
  @ApiParam({ name: 'contractId', type: Number })
  @ApiParam({ name: 'systemId', type: Number })
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
  @ApiParam({ name: 'contractId', type: Number })
  async getContractTools(
    @Param('contractId') contractId: number,
  ): Promise<ResponseDataDto> {
    return this.contractService.getContractSystemTool(contractId);
  }

  /*
  Get contract details
   */
  @Get('/:id')
  @ApiParam({ name: 'id', type: Number })
  async getContractDetails(@Param('id') id: number): Promise<ResponseDataDto> {
    return this.contractService.getContractDetails(id);
  }

  /*
  Add reminder
   */
  @Put('reminder/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: ReminderDto })
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
  @ApiParam({ name: 'id', type: Number })
  async removeReminder(
    @Param('id') reminderId: number,
  ): Promise<ResponseDataDto> {
    return this.contractService.removeReminder(reminderId);
  }

  /*
  Add audit metric for tool
   */
  @Put('metric/tool/audit/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: AuditMetricDto })
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
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: AuditMetricDto })
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
  @ApiBody({ type: [ContractDto] })
  async uploadLicenseContract(
    @Body() data: ContractDto[],
  ): Promise<ResponseDataDto> {
    return this.contractService.uploadContract(data);
  }

  /*
  Get All Contracts System Tool Metrics by Department
   */
  @Get('tool/metric/department/:id')
  @ApiParam({ name: 'id', type: Number })
  async getContractSystemToolMetrics(
    @Param('id') id: number,
  ): Promise<ResponseDataDto> {
    return this.contractService.getContractsToolsDepartment(id);
  }

  /*
  Contracts Expiration Reminders By department
   */
  @Get('reminders/department/:id')
  @ApiParam({ name: 'id', type: Number })
  async getContractsRemindersByDepartment(@Param('id') id: number) {
    return this.contractService.getContractsRemindersByDepartment(id);
  }
}
