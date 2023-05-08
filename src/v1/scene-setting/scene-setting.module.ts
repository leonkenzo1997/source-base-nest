import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsModule } from '../groups/groups.module';
import { SceneModule } from '../scene/scene.module';
import { UsersModule } from '../users/users.module';
import { ZonesModule } from '../zones/zones.module';
import { SceneSetting } from './entities/scene-setting.entity';
import { SceneSettingRepository } from './repositories/scene-setting.repository';
import { SceneSettingController } from './scene-setting.controller';
import { SceneSettingService } from './scene-setting.service';

@Module({
  controllers: [SceneSettingController],
  imports: [
    TypeOrmModule.forFeature([SceneSetting]),
    UsersModule,
    ZonesModule,
    GroupsModule,
    forwardRef(() => SceneModule),
  ],
  providers: [SceneSettingService, SceneSettingRepository],
  exports: [SceneSettingService],
})
export class SceneSettingModule {}
