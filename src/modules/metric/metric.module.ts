import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricEntity } from './entities/metric.entity';
import { MetricController } from './controllers/metric.controller';
import { MetricService } from './services/metric.service';

@Module({
  imports: [TypeOrmModule.forFeature([MetricEntity])],
  providers: [MetricService],
  controllers: [MetricController],
})
export class MetricModule {}
