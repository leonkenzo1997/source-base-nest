import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevicesModule } from '../devices/devices.module';
import { FloorsModule } from '../floors/floors.module';
import { SceneModule } from '../scene/scene.module';
import { UsersModule } from '../users/users.module';
import { DeleteSchedule } from './entities/delete-schedule.entity';
import { Schedule } from './entities/schedule.entity';
import { DeleteScheduleRepository } from './repositories/delete-schedule.repository';
import { ScheduleRepository } from './repositories/schedule.repository';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

@Module({
  controllers: [ScheduleController],
  imports: [
    TypeOrmModule.forFeature([Schedule, DeleteSchedule]),
    FloorsModule,
    SceneModule,
    UsersModule,
    DevicesModule,
  ],
  providers: [ScheduleService, ScheduleRepository, DeleteScheduleRepository],
  exports: [ScheduleService],
})
export class ScheduleModule {}
