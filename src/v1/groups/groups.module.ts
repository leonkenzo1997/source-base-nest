import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceSettingModule } from '../device-setting/device-setting.module';
import { DevicesModule } from '../devices/devices.module';
import { UsersModule } from '../users/users.module';
import { ZonesModule } from '../zones/zones.module';
import { DeleteGroup } from './entities/delete-group.entity';
import { GroupSetting } from './entities/group-setting.entity';
import { Group } from './entities/group.entity';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { DeleteGroupsRepository } from './repositories/delete-group.repository';
import { GroupsSettingRepository } from './repositories/groups-setting.repository';
import { GroupsRepository } from './repositories/groups.repository';

@Module({
  controllers: [GroupsController],
  imports: [
    TypeOrmModule.forFeature([Group, DeleteGroup, GroupSetting]),
    ZonesModule,
    UsersModule,
    forwardRef(() => DeviceSettingModule),
    forwardRef(() => DevicesModule),
  ],
  providers: [
    GroupsService,
    GroupsRepository,
    DeleteGroupsRepository,
    GroupsSettingRepository,
  ],
  exports: [GroupsService],
})
export class GroupsModule {}
