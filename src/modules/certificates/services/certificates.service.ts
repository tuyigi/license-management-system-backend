import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentEntity } from '../../departments/entities/department.entity';
import { Raw, Repository } from 'typeorm';
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
      if (
        new Date(`${certificateDto.issue_date}`).getMilliseconds() >
        new Date(`${certificateDto.expiration_date}`).getMilliseconds()
      )
        throw new BadRequestException(
          `Expiration date should be greater than issue date`,
        );
      const certificate: CertificateEntity = new CertificateEntity();
      certificate.certificate = certificateDto.certificate_name;
      certificate.issue_date = new Date(
        Date.parse(`${certificateDto.issue_date}`),
      );
      certificate.expiry_date = new Date(
        Date.parse(`${certificateDto.expiration_date}`),
      );
      certificate.certificate_type = certificateDto.certificate_type;
      certificate.department_id = department;
      certificate.user_organization = certificateDto.user_organization;
      certificate.description = certificateDto.description;
      const saved = await this.certificateRepository.save(certificate);
      return new ResponseDataDto(saved, 201, 'Certificate added successfully');
    } catch (e) {
      throw e;
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

      if (
        new Date(`${certificateDto.issue_date}`).getMilliseconds() >
        new Date(`${certificateDto.expiration_date}`).getMilliseconds()
      )
        throw new BadRequestException(
          `Expiration date should be greater than issue date`,
        );
      certificate.issue_date = new Date(
        Date.parse(`${certificateDto.issue_date}`),
      );
      certificate.expiry_date = new Date(
        Date.parse(`${certificateDto.expiration_date}`),
      );
      certificate.certificate_type = certificateDto.certificate_type;
      certificate.department_id = department;
      certificate.description = certificateDto.description;
      certificate.user_organization = certificateDto.user_organization;
      certificate.certificate = certificateDto.certificate_name;
      await this.certificateRepository.save(certificate);
      return new ResponseDataDto(certificate);
    } catch (e) {
      throw e;
    }
  }

  /*
  Get Certificates
   */
  async getCertificates(): Promise<ResponseDataDto> {
    try {
      const certificates = await this.certificateRepository.find({
        relations: { department_id: true },
        order: { created_at: 'desc' },
      });
      return new ResponseDataDto(certificates);
    } catch (e) {
      throw e;
    }
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
          order: { created_at: 'desc' },
        });
      return new ResponseDataDto(certificates);
    } catch (e) {
      throw e;
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
      throw e;
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
        relations: { certificate_id: true },
        order: { created_at: 'desc' },
      });
      return new ResponseDataDto(reportedCertificates);
    } catch (e) {
      throw e;
    }
  }

  /*
  Get reported certificate
   */
  async getReportedCertificate(): Promise<ResponseDataDto> {
    try {
      const reportedCertificates = await this.certificateReportRepository.find({
        relations: { certificate_id: true, responsible: true },
        order: { created_at: 'desc' },
      });
      return new ResponseDataDto(reportedCertificates);
    } catch (e) {
      throw e;
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
        order: { created_at: 'desc' },
      });
      return new ResponseDataDto(reportedCertificates);
    } catch (e) {
      throw e;
    }
  }

  /*
    Upload Certificate
   */
  async uploadCertificate(
    certificateDto: CertificateDto[],
  ): Promise<ResponseDataDto> {
    const savedCertificates = [];
    try {
      for (const dto of certificateDto) {
        const department: DepartmentEntity =
          await this.departmentRepository.findOne({
            where: { id: dto.department_id },
          });
        if (!department)
          throw new NotFoundException(
            `Department with ID:${dto.department_id} not found`,
          );
        if (
          new Date(`${dto.issue_date}`).getMilliseconds() >
          new Date(`${dto.expiration_date}`).getMilliseconds()
        )
          throw new BadRequestException(
            `Expiration date should be greater than issue date`,
          );
        const certificate: CertificateEntity = new CertificateEntity();
        certificate.certificate = dto.certificate_name;
        certificate.issue_date = new Date(Date.parse(`${dto.issue_date}`));
        certificate.expiry_date = new Date(
          Date.parse(`${dto.expiration_date}`),
        );
        certificate.certificate_type = dto.certificate_type;
        certificate.department_id = department;
        certificate.user_organization = dto.user_organization;
        certificate.description = dto.description;
        const saved = await this.certificateRepository.save(certificate);
        savedCertificates.push(saved);
      }
      return new ResponseDataDto(
        savedCertificates,
        201,
        'Certificate added successfully',
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  //Certificate Expiration reminders
  async getReminders(id: number) {
    const department: DepartmentEntity =
      await this.departmentRepository.findOne({
        where: { id },
      });

    if (!department) {
      throw new NotFoundException(`Department with ID: ${id} not found`);
    }

    const expiringSoon = await this.certificateRepository.find({
      where: {
        department_id: { id: department.id },
        expiry_date: Raw(
          (alias) =>
            `DATE(${alias}) BETWEEN CURRENT_DATE + INTERVAL '1 day' AND CURRENT_DATE + INTERVAL '15 days'`,
        ),
      },
      relations: {
        department_id: true,
      },
    });

    return {
      count: expiringSoon.length || 0,
      items: expiringSoon || [],
    };
  }
}
