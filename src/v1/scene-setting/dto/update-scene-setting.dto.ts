import { PartialType } from '@nestjs/mapped-types';
import { CreateSceneSettingDto } from './create-scene-setting.dto';

export class UpdateSceneSettingDto extends PartialType(CreateSceneSettingDto) {}
