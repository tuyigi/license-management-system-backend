import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Functions } from './entities/functions.entity';
import { SystemFunctions } from './entities/system-functions.entity';
import { SystemFunctionsService } from './services/system-functions.service';
import { SystemFunctionsController } from './controller/system-functions.controller';
import { SystemTool } from '../system-tools/entities/system-tool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Functions, SystemFunctions, SystemTool])],
  providers: [SystemFunctionsService],
  controllers: [SystemFunctionsController],
})
export class SystemFunctionsModule {}
