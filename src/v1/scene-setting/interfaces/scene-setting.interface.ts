import { ISceneSettingArea } from '../../scene-setting-area/interfaces/scene-setting-area.interface';
import { IScene } from '../../scene/interfaces/scene.interface';
export interface ISceneSetting {
  id: number;

  name?: string;

  brightness?: number;

  tone?: number;

  deletedAt?: Date;

  protocolSceneSettingId?: number;

  createdAt?: Date;

  status?: boolean;

  updatedAt?: Date;

  scene?: IScene;

  sceneSettingArea?: ISceneSettingArea[];

  zone?: any[];
}
