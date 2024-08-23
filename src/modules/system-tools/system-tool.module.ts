import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemTool } from './entities/system-tool.entity';
import { SystemToolService } from './services/system-tool.service';
import { SystemToolController } from './controllers/system-tool.controller';
import { DepartmentEntity } from '../departments/entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SystemTool, DepartmentEntity])],
  providers: [SystemToolService],
  controllers: [SystemToolController],
})
export class SystemToolModule {}
