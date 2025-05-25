import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { MetricService } from '../services/metric.service';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { MetricDto } from '../dtos/metric.dto';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('metric')
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  /*
  Add Metric
   */
  @Post()
  @ApiBody({ type: MetricDto })
  addMetric(@Body() metricDto: MetricDto): Promise<ResponseDataDto> {
    return this.metricService.addMetric(metricDto);
  }

  /*
  Update Metric
   */
  @Put('/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: MetricDto })
  updateMetric(
    @Param('id') id: number,
    @Body() metricDto: MetricDto,
  ): Promise<ResponseDataDto> {
    return this.metricService.updateMetric(id, metricDto);
  }

  /*
  Get Metrics
   */
  @Get()
  async getMetrics(): Promise<ResponseDataDto> {
    return this.metricService.getMetric();
  }
}
