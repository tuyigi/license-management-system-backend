import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MetricService } from '../services/metric.service';
import { ResponseDataDto } from '../../../common/dtos/response-data.dto';
import { MetricDto } from '../dtos/metric.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';

@UseGuards(new JwtAuthGuard())
@Controller('metric')
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  /*
  Add Metric
   */
  @Post()
  addMetric(@Body() metricDto: MetricDto): Promise<ResponseDataDto> {
    return this.metricService.addMetric(metricDto);
  }

  /*
  Update Metric
   */
  @Put('/:id')
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
