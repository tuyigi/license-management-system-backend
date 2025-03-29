import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { MetricDto } from '../dtos/metric.dto';
import { MetricEntity } from '../entities/metric.entity';

@Injectable()
export class MetricService {
  constructor(
    @InjectRepository(MetricEntity)
    private readonly metricRepository: Repository<MetricEntity>,
  ) {}

  /*
  Add new Metric
   */
  async addMetric(metricDto: MetricDto): Promise<ResponseDataDto> {
    try {
      const metric = new MetricEntity();
      metric.name = metricDto.name;
      metric.description = metricDto.description || null;
      const savedMetric = await this.metricRepository.save(metric);
      return new ResponseDataDto(savedMetric);
    } catch (e) {
      throw e;
    }
  }

  /* 
  Update Metrics
   */
  async updateMetric(
    id: number,
    metricDto: MetricDto,
  ): Promise<ResponseDataDto> {
    try {
      const metric = await this.metricRepository.findOne({ where: { id } });
      if (metric)
        throw new NotFoundException(`Metric with ID: ${id} not found`);
      metric.name = metricDto.name;
      metricDto.description
        ? (metric.description = metricDto.description)
        : null;
      await this.metricRepository.save(metric);
      return new ResponseDataDto(metric);
    } catch (e) {
      throw e;
    }
  }

  /*
  Get Metric
   */
  async getMetric(): Promise<ResponseDataDto> {
    try {
      const metrics: MetricEntity[] = await this.metricRepository.find({
        order: { created_at: 'DESC' },
      });
      return new ResponseDataDto(metrics, 200, `Metric retrieved successfully`);
    } catch (e) {
      throw e;
    }
  }
}
