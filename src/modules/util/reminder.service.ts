import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ContractService } from '../contracts/services/contract.service';
import { CertificatesService } from '../certificates/services/certificates.service';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    private readonly contractService: ContractService,
    private readonly certificatesService: CertificatesService,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleReminderCron() {
    console.log('Cron job triggered');
    this.logger.log('Cron job started');
    try {
      await this.contractService.getContractDataForCronJob();
    } catch (e) {
      this.logger.error('Contract cron failed', e.stack);
    }

    try {
      await this.certificatesService.getCertificateDataForCronJob();
    } catch (e) {
      this.logger.error('Certificate cron failed', e.stack);
    }
  }
}
