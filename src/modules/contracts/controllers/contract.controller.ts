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
    @Param('id') id: number,
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
  ): Promise<ResponseDataDto> {
    return this.contractService.changeApprovalStatus(id, status);
  }
}
