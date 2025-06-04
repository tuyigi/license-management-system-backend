import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { License } from '../entities/license.entity';
import { Repository } from 'typeorm';
import { CreateLicenceDto } from '../dtos/create_license.dto';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { SystemTool } from '../../system-tools/entities/system-tool.entity';
import { DepartmentEntity } from '../../departments/entities/department.entity';
import { AuditMetricDto } from '../../contracts/dtos/tool-metric.dto';
import { LicenseToolMetricEntity } from '../entities/license-tool-metric.entity';
import { MetricEntity } from '../../metric/entities/metric.entity';
import { LicenseToolDto } from '../dtos/license_tool.dto';
import { LicenseToolEntity } from '../entities/license-tool.entity';

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License)
    private readonly licenseRepository: Repository<License>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(SystemTool)
    private readonly systemToolRepository: Repository<SystemTool>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
    @InjectRepository(LicenseToolMetricEntity)
    private readonly toolMetricRepository: Repository<LicenseToolMetricEntity>,
    @InjectRepository(MetricEntity)
    private readonly metricRepository: Repository<MetricEntity>,
    @InjectRepository(LicenseToolEntity)
    private readonly licenseToolEntityRepository: Repository<LicenseToolEntity>,
  ) {}

  /*
  Create new license
   */

  async createLicense(
    createLicenceDto: CreateLicenceDto,
  ): Promise<ResponseDataDto> {
    try {
      const {
        code,
        name,
        description,
        license_fees,
        payment_frequency,
        number_system_users,
        currency,
        start_date,
        end_date,
      } = createLicenceDto;
      let license: License = await this.licenseRepository.findOne({
        where: { code, name },
      });
      if (license)
        throw new ConflictException(
          `License with code: ${code} or name: ${name} already exists`,
        );
      const vendor: Vendor = await this.vendorRepository.findOne({
        where: { id: createLicenceDto.vendor },
      });
      if (!vendor)
        throw new NotFoundException(
          `Vendor with ID: ${createLicenceDto.vendor} doesn't exist`,
        );
      const department: DepartmentEntity =
        await this.departmentRepository.findOne({
          where: {
            id: createLicenceDto.department,
          },
        });
      if (!department)
        throw new NotFoundException(
          `Department with ID: ${createLicenceDto.department} doesn't exist`,
        );
      const system: SystemTool = await this.systemToolRepository.findOne({
        where: { id: createLicenceDto.system_tool },
      });
      if (!system)
        throw new NotFoundException(
          `System Tool with ID: ${createLicenceDto.system_tool}`,
        );
      license = new License();
      license.name = name;
      license.code = code;
      license.description = description;
      license.vendor = vendor;
      license.department_id = department;
      license.system_tool = system;
      license.license_fees = license_fees;
      license.payment_frequency = payment_frequency;
      license.number_system_users = number_system_users;
      license.currency = currency;
      license.start_date = new Date(`${start_date}`);
      license.end_date = new Date(`${end_date}`);
      const savedLicense = await this.licenseRepository.save(license);
      return new ResponseDataDto(
        savedLicense,
        201,
        `License saved successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Update license
   */

  async updateLicense(
    id: number,
    updateLicenseDto: CreateLicenceDto,
  ): Promise<ResponseDataDto> {
    try {
      const {
        code,
        description,
        name,
        payment_frequency,
        license_fees,
        number_system_users,
        currency,
        start_date,
        end_date,
      } = updateLicenseDto;
      const license: License = await this.licenseRepository.findOne({
        where: { id },
      });
      if (!license)
        throw new NotFoundException(`License with id: ${id} not found`);
      const vendor: Vendor = await this.vendorRepository.findOne({
        where: { id: updateLicenseDto.vendor },
      });
      if (!vendor)
        throw new NotFoundException(
          `Vendor with ID: ${updateLicenseDto.vendor} doesn't exist`,
        );
      const department: DepartmentEntity =
        await this.departmentRepository.findOne({
          where: {
            id: updateLicenseDto.department,
          },
        });
      if (!department)
        throw new NotFoundException(
          `Department with ID: ${updateLicenseDto.department} doesn't exist`,
        );
      const system: SystemTool = await this.systemToolRepository.findOne({
        where: { id: updateLicenseDto.system_tool },
      });
      if (!system)
        throw new NotFoundException(
          `System Tool with ID: ${updateLicenseDto.system_tool}`,
        );
      license.name = name;
      license.code = code;
      license.description = description;
      license.vendor = vendor;
      license.department_id = department;
      license.system_tool = system;
      license.payment_frequency = payment_frequency;
      license.license_fees = license_fees;
      license.number_system_users = number_system_users;
      license.currency = currency;
      license.start_date = new Date(`${start_date}`);
      license.end_date = new Date(`${end_date}`);
      const savedLicense = await this.licenseRepository.save(license);
      return new ResponseDataDto(
        savedLicense,
        201,
        `License updated successfully`,
      );
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
  Get One License
   */

  async getOneLicense(id: number): Promise<ResponseDataDto> {
    const license: License = await this.licenseRepository.findOne({
      where: { id },
    });
    if (!license)
      throw new NotFoundException(`License with id: ${id} not found`);
    return new ResponseDataDto(license, 200, `License retrieved succcessfully`);
  }

  /*
  Get Licenses 
   */

  async getLicenses(): Promise<ResponseDataDto> {
    const licenses: License[] = await this.licenseRepository.find({
      order: { created_at: 'DESC' },
      relations: { vendor: true },
    });
    return new ResponseDataDto(
      licenses,
      200,
      `Licenses retrieved successfully`,
    );
  }

  /*
Get Licenses by Department
 */
  async getLicenseDepartment(id: number): Promise<ResponseDataDto> {
    try {
      const licenses = await this.licenseRepository.find({
        where: { department_id: { id } },
        relations: {
          vendor: true,
          system_tool: true,
          department_id: true,
        },
        order: { created_at: 'DESC' },
      });
      return new ResponseDataDto(licenses);
    } catch (e) {
      throw new BadRequestException(`${e.message}`);
    }
  }

  /*
Get License details and Metrics
 */
  async getLicenseDetails(id: number): Promise<ResponseDataDto> {
    try {
      const license = await this.licenseRepository.findOne({
        where: { id },
        relations: {
          vendor: true,
          system_tool: true,
        },
      });

      if (!license)
        throw new NotFoundException(`Contract with ID:${id} not found`);

      // retrieve license system tools with metrics
      const rawQuery = `
          SELECT lst.id,lst.created_at,lst.updated_at,
                 ltm.id as license_system_tool_metric_id,ltm.entitlement,ltm.utilisation,ltm.license_gap,ltm.license_system_tool,
                 ltm.metric,ltm.comment,   st.system_tool_name, st.description,st.department,m.name
          FROM license_system_tools lst
                   LEFT JOIN license_tool_metric ltm ON lst.id = ltm.license_system_tool
                   INNER JOIN system_tools st ON lst.system_tool = st.id
                   LEFT JOIN metrics m ON ltm.metric = m.id
          WHERE lst.license = $1`;
      const resultTools = await this.licenseRepository.query(rawQuery, [id]);
      const response = {
        ...license,
        toolsMetrics: resultTools,
      };
      return new ResponseDataDto(response);
    } catch (e) {
      throw e;
    }
  }

  async addLicenseToolMetric(
    id: number,
    toolMetricDto: AuditMetricDto,
  ): Promise<ResponseDataDto> {
    try {
      const license_tool_metric = await this.toolMetricRepository.findOne({
        where: { id },
      });
      if (!license_tool_metric)
        throw new NotFoundException(`Metrics for ID ${id} not found`);
      license_tool_metric.entitlement = toolMetricDto.entitlement || 0;
      license_tool_metric.utilisation = toolMetricDto.utilisation || 0;
      license_tool_metric.license_gap =
        license_tool_metric.entitlement - license_tool_metric.utilisation;
      license_tool_metric.comment = toolMetricDto.comment;
      await this.toolMetricRepository.save(license_tool_metric);
      return new ResponseDataDto(license_tool_metric);
    } catch (e) {
      throw e;
    }
  }
  /*
  Add System Tool
*/
  async addSystemTool(
    licenseId: number,
    systemId: number,
    licenseToolDto: LicenseToolDto,
  ): Promise<ResponseDataDto> {
    try {
      const license: License = await this.licenseRepository.findOne({
        where: { id: licenseId },
      });
      if (!license)
        throw new NotFoundException(`License with ID: ${licenseId} not found`);
      const system: SystemTool = await this.systemToolRepository.findOne({
        where: { id: systemId },
      });

      if (!system)
        throw new NotFoundException(`System Tool with ID: ${system.id}`);

      // validate metrics if they are provided
      const metrics: MetricEntity[] = [];
      if (licenseToolDto?.metrics?.length > 0) {
        let notFoundCount = 0;
        for (let i = 0; i < licenseToolDto.metrics.length; i++) {
          const metric = await this.metricRepository.findOne({
            where: { id: licenseToolDto.metrics[i] },
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
      const licenseTool = new LicenseToolEntity();
      licenseTool.license = license;

      licenseTool.system_tool = system;
      const saved = await this.licenseToolEntityRepository.save(licenseTool);
      // save license metric tool details
      for (let i = 0; i < metrics.length; i++) {
        console.log('insert metric');
        const toolMetric = new LicenseToolMetricEntity();
        toolMetric.metric = metrics[i];
        toolMetric.license_system_tool = saved;
        await this.toolMetricRepository.save(toolMetric);
      }
      return new ResponseDataDto(saved);
    } catch (e) {
      throw e;
    }
  }
}
