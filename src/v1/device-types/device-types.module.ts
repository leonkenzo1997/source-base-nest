import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceTypesController } from './device-types.controller';
import { DeviceTypesService } from './device-types.service';
import { DeviceType } from './entities/device-type.entity';
import { DeviceTypesRepository } from './repositories/device-types.repository';

@Module({
  controllers: [DeviceTypesController],
  providers: [DeviceTypesService, DeviceTypesRepository],
  imports: [TypeOrmModule.forFeature([DeviceType])],
  exports: [DeviceTypesService],
})
export class DeviceTypesModule {}
