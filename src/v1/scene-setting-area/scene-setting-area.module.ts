import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SceneSettingArea } from './entities/scene-setting-area.entity';
import { SceneSettingAreaController } from './scene-setting-area.controller';
import { SceneSettingAreaService } from './scene-setting-area.service';


@Module({
  controllers: [SceneSettingAreaController],
  providers: [SceneSettingAreaService],
  imports: [TypeOrmModule.forFeature([SceneSettingArea])],
  exports: [SceneSettingAreaService],
})
export class SceneSettingAreaModule {}
