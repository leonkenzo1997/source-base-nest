import { Controller } from '@nestjs/common';
import { SceneSettingAreaService } from './scene-setting-area.service';

@Controller()
export class SceneSettingAreaController {
  constructor(private readonly sceneSettingAreaService: SceneSettingAreaService) {}
}
