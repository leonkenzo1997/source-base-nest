import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FloorsModule } from '../floors/floors.module';
import { GroupsModule } from '../groups/groups.module';
import { ZonesModule } from '../zones/zones.module';
import { DeviceSettingModule } from './../device-setting/device-setting.module';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { DeleteDevices } from './entities/delete-device.entity';
import { DevicesEntity } from './entities/device.entity';
import { GatewayManageAreaEntity } from './entities/gateway-manage-area.entity';
import { DeleteDevicesRepository } from './repositories/delete-device.repository';
import { DevicesRepository } from './repositories/devices.repository';
import { GatewayManageAreaRepository } from './repositories/gateway-manage-area.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DevicesEntity,
      DeleteDevices,
      GatewayManageAreaEntity,
    ]),
    FloorsModule,
    forwardRef(() => ZonesModule),
    forwardRef(() => GroupsModule),
    forwardRef(() => DeviceSettingModule),
  ],
  controllers: [DevicesController],
  providers: [
    DevicesService,
    DevicesRepository,
    DeleteDevicesRepository,
    GatewayManageAreaRepository,
  ],
  exports: [DevicesService],
})
export class DevicesModule {}
