import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBuildingFloor } from './entities/user-building-floor.entity';
import { UserBuildingFloorRepository } from './repositories/users-buildings-floors.repository';
import { UsersBuildingsFloorsController } from './users-buildings-floors.controller';
import { UsersBuildingsFloorsService } from './users-buildings-floors.service';

@Module({
  controllers: [UsersBuildingsFloorsController],
  imports: [TypeOrmModule.forFeature([UserBuildingFloor])],
  providers: [UsersBuildingsFloorsService, UserBuildingFloorRepository],
  exports: [UsersBuildingsFloorsService],
})
export class UserBuildingFloorModule {}
