import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevicesModule } from '../devices/devices.module';
import { DeviceSettingController } from './device-setting.controller';
import { DeviceSettingService } from './device-setting.service';
import { DeviceSetting } from './entities/device-setting.entity';
import { DeviceSettingRepository } from './repositories/device-setting.repository';
import { FloorsModule } from "../floors/floors.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceSetting]),
    forwardRef(() => DevicesModule),
    FloorsModule
  ],
  controllers: [DeviceSettingController],
  providers: [DeviceSettingService, DeviceSettingRepository],
  exports: [DeviceSettingService],
})
export class DeviceSettingModule {}
