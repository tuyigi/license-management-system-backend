import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentEntity } from '../departments/entities/department.entity';
import { CertificateEntity } from './entities/certificate.entity';
import { User } from '../users/entities/user.entity';
import { CertificateReportEntity } from './entities/certificate-report.entity';
import { CertificatesService } from './services/certificates.service';
import { CertificatesController } from './controllers/certificates.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MailModule,
    TypeOrmModule.forFeature([
      DepartmentEntity,
      CertificateEntity,
      User,
      CertificateReportEntity,
    ]),
  ],
  providers: [CertificatesService],
  controllers: [CertificatesController],
  exports: [CertificatesService],
})
export class CertificatesModule {}
