import { Module } from '@nestjs/common';
import { LicenseRequestService } from './services/license-request.service';
import { LicenseRequestController } from './controllers/license-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../organizations/entities/organization.entity';
import { OrganizationLicense } from '../organizations/entities/organization_license.entity';
import { User } from '../users/entities/user.entity';
import { License } from '../licenses/entities/license.entity';
import { LicenseRequest } from './entities/license-request.entity';
import { RequestAuditTrail } from './entities/request-audit-trail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      OrganizationLicense,
      User,
      License,
      LicenseRequest,
      RequestAuditTrail,
    ]),
  ],
  controllers: [LicenseRequestController],
  providers: [LicenseRequestService],
})
export class LicenseRequestModule {}
