/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingsModule } from '../buildings/buildings.module';
import { UserBuildingFloorModule } from '../users-buildings-floors/users-buildings-floors.module';
import { UsersModule } from '../users/users.module';
import { FloorEntity } from './entities/floor.entity';
import { FloorsController } from './floors.controller';
import { FloorsService } from './floors.service';
import { FloorsRepository } from './repositories/floor.repository';

@Module({
  controllers: [FloorsController],
  imports: [
    TypeOrmModule.forFeature([FloorEntity]),
    forwardRef(() => UsersModule),
    UserBuildingFloorModule,
    forwardRef(() => BuildingsModule),
  ],
  providers: [FloorsService, FloorsRepository],
  exports: [FloorsService],
})
export class FloorsModule {}
