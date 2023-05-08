import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevicesModule } from '../devices/devices.module';
import { FloorsModule } from '../floors/floors.module';
import { UsersModule } from '../users/users.module';
import { DeleteZone } from './entities/delete-zone.entity';
import { ZoneEntity } from './entities/zone.entity';
import { DeleteZonesRepository } from './repositories/delete-zone.repository';
import { ZonesRepository } from './repositories/zones.repository';
import { ZonesController } from './zones.controller';
import { ZonesService } from './zones.service';

@Module({
  controllers: [ZonesController],
  imports: [
    TypeOrmModule.forFeature([ZoneEntity]),
    TypeOrmModule.forFeature([DeleteZone]),
    FloorsModule,
    UsersModule,
    forwardRef(() => DevicesModule),
  ],
  providers: [ZonesService, ZonesRepository, DeleteZonesRepository],
  exports: [ZonesService],
})
export class ZonesModule {}
