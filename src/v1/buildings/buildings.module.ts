/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FloorsModule } from '../floors/floors.module';
import { UsersModule } from '../users/users.module';
import { BuildingsController } from './buildings.controller';
import { BuildingsService } from './buildings.service';
import { Building } from './entities/building.entity';
import { BuildingRepository } from './repositories/buildings.repository';

@Module({
  controllers: [BuildingsController],
  providers: [BuildingsService, BuildingRepository],
  imports: [
    TypeOrmModule.forFeature([Building]),
    forwardRef(() => UsersModule),
    forwardRef(() => FloorsModule),
  ],
  exports: [BuildingsService],
})
export class BuildingsModule {}
