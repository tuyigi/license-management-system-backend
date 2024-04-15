import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentEntity } from '../../departments/entities/department.entity';
import { Repository } from 'typeorm';
import { CertificateEntity } from '../entities/certificate.entity';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { CertificateDto } from '../dtos/certificate.dto';
import { CertificateReportDto } from '../dtos/certificate-report.dto';
import { User } from '../../users/entities/user.entity';
import { CertificateReportEntity } from '../entities/certificate-report.entity';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
    @InjectRepository(CertificateEntity)
    private readonly certificateRepository: Repository<CertificateEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CertificateReportEntity)
    private readonly certificateReportRepository: Repository<CertificateReportEntity>,
  ) {}

  /*
  Add Certificate
   */
  async addCertificate(
    certificateDto: CertificateDto,
  ): Promise<ResponseDataDto> {
    try {
      const department: DepartmentEntity =
        await this.departmentRepository.findOne({
          where: { id: certificateDto.department_id },
        });
      if (!department)
        throw new NotFoundException(
          `Department with ID:${certificateDto.department_id} not found`,
        );
      const certificate: CertificateEntity = new CertificateEntity();
      certificate.certificate = certificateDto.certificate_name;
      certificate.department_id = department;
      certificate.user_organization = certificateDto.user_organization;
      certificate.description = certificateDto.description;
      const saved = await this.certificateRepository.save(certificate);
      return new ResponseDataDto(saved, 201, 'Certificate added successfully');
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Update Certificate
   */
  async updateCertificate(
    id: number,
    certificateDto: CertificateDto,
  ): Promise<ResponseDataDto> {
    try {
      const certificate: CertificateEntity =
        await this.certificateRepository.findOne({ where: { id } });
      if (!certificate)
        throw new NotFoundException(`Certificate with ID: ${id} not found`);
      const department: DepartmentEntity =
        await this.departmentRepository.findOne({
          where: { id: certificateDto.department_id },
        });
      if (!department) throw new NotFoundException(`Department not found`);
      certificate.department_id = department;
      certificate.description = certificateDto.description;
      certificate.user_organization = certificateDto.user_organization;
      certificate.certificate = certificateDto.certificate_name;
      await this.certificateRepository.save(certificate);
      return new ResponseDataDto(certificate);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get Certificates
   */
  async getCertificates(): Promise<ResponseDataDto> {
    try {
      const certificates = await this.certificateRepository.find({
        relations: { department_id: true },
      });
      return new ResponseDataDto(certificates);
    } catch (e) {}
  }

  /*
  Get Certificate by department
   */
  async getCertificateDepartment(id: number): Promise<ResponseDataDto> {
    try {
      const department: DepartmentEntity =
        await this.departmentRepository.findOne({ where: { id } });
      if (!department)
        throw new NotFoundException(`Department with ID: ${id} not found`);
      const certificates: CertificateEntity[] =
        await this.certificateRepository.find({
          where: { department_id: { id: department.id } },
          relations: { department_id: true },
        });
      return new ResponseDataDto(certificates);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Report Certificate
   */
  async reportCertificate(
    certificateReportDto: CertificateReportDto,
  ): Promise<ResponseDataDto> {
    try {
      const certificate: CertificateEntity =
        await this.certificateRepository.findOne({
          where: { id: certificateReportDto.certificate_id },
        });
      if (!certificate)
        throw new NotFoundException(
          `Certificate with ID: ${certificateReportDto.certificate_id} not found`,
        );
      const responsible: User = await this.userRepository.findOne({
        where: { id: certificateReportDto.responsible },
      });
      if (!responsible)
        throw new NotFoundException(
          `User Responsible with ID: ${certificateReportDto.certificate_id} not found`,
        );
      // check expiry date

      const certificateReport: CertificateReportEntity =
        new CertificateReportEntity();
      certificateReport.certificate_id = certificate;
      certificateReport.responsible = responsible;
      certificateReport.expiry_date = new Date(
        certificateReportDto.expiry_date,
      );
      certificateReport.issue_date = new Date(certificateReportDto.issue_date);
      const saved: CertificateReportEntity =
        await this.certificateReportRepository.save(certificateReport);
      return new ResponseDataDto(saved);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get Certificate Report by certificate
   */
  async getReportCertificateByCertificate(
    id: number,
  ): Promise<ResponseDataDto> {
    try {
      const certificate: CertificateEntity =
        await this.certificateRepository.findOne({
          where: { id },
        });
      if (!certificate)
        throw new NotFoundException(`Certificate with ID: ${id}`);
      const reportedCertificates = await this.certificateReportRepository.find({
        where: { certificate_id: { id: certificate.id } },
      });
      return new ResponseDataDto(reportedCertificates);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get reported certificate
   */
  async getReportedCertificate(): Promise<ResponseDataDto> {
    try {
      const reportedCertificates = await this.certificateReportRepository.find({
        relations: { certificate_id: true, responsible: true },
      });
      return new ResponseDataDto(reportedCertificates);
    } catch (e) {
      throw new BadRequestException(``);
    }
  }

  /*
  Get reported certificates by user
   */
  async getReportedCertificateByUser(id: number): Promise<ResponseDataDto> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new NotFoundException(`User with ID: ${id}`);
      const reportedCertificates = await this.certificateReportRepository.find({
        where: { responsible: { id: user.id } },
      });
      return new ResponseDataDto(reportedCertificates);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }
}
