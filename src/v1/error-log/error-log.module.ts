import { Module } from '@nestjs/common';
import { ErrorLogService } from './error-log.service';
import { ErrorLogController } from './error-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorLog } from './entities/error-log.entity';
import { ErrorLogRepository } from './repostiories/error-log.repository';
import { UsersModule } from '../users/users.module';
import { BuildingsModule } from '../buildings/buildings.module';

@Module({
  controllers: [ErrorLogController],
  imports: [TypeOrmModule.forFeature([ErrorLog]), UsersModule, BuildingsModule],
  providers: [ErrorLogService, ErrorLogRepository],
  exports: [ErrorLogService],
})
export class ErrorLogModule {}
