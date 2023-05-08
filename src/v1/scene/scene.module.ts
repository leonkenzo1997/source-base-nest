import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevicesModule } from '../devices/devices.module';
import { FloorsModule } from '../floors/floors.module';
import { GroupsModule } from '../groups/groups.module';
import { SceneSettingModule } from '../scene-setting/scene-setting.module';
import { UsersModule } from '../users/users.module';
import { ZonesModule } from '../zones/zones.module';
import { DeleteScene } from './entities/delete-scene.entity';
import { Scene } from './entities/scene.entity';
import { DeleteScenesRepository } from './repositories/delete-scene.repository';
import { ScenesRepository } from './repositories/scenes.repository';
import { SceneController } from './scene.controller';
import { SceneService } from './scene.service';

@Module({
  controllers: [SceneController],
  imports: [
    TypeOrmModule.forFeature([Scene, DeleteScene]),
    FloorsModule,
    ZonesModule,
    GroupsModule,
    UsersModule,
    forwardRef(() => SceneSettingModule),
    DevicesModule,
  ],
  providers: [SceneService, ScenesRepository, DeleteScenesRepository],
  exports: [SceneService],
})
export class SceneModule {}
