import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBuilding } from './entities/user-building.entity';
import { UserBuildingRepository } from './repositories/users-building.repository';
import { UserBuildingController } from './users-buildings.controller';
import { UserBuildingService } from './users-buildings.service';

@Module({
  controllers: [UserBuildingController],
  providers: [UserBuildingService, UserBuildingRepository],
  imports: [TypeOrmModule.forFeature([UserBuilding])],
  exports: [UserBuildingService],
})
export class UsersBuildingsModule {}
