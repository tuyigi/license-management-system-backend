import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemTool } from './entities/system-tool.entity';
import { SystemToolService } from './services/system-tool.service';
import { SystemToolController } from './controllers/system-tool.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SystemTool])],
  providers: [SystemToolService],
  controllers: [SystemToolController],
})
export class SystemToolModule {}
