import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationLicense } from './entities/organization_license.entity';
import { OrganizationService } from './services/organization.service';
import { OrganizationController } from './controller/organization.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, OrganizationLicense])],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationsModule {}
