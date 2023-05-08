import { IFloor } from 'src/v1/floors/interfaces/floor.interface';
import { ISceneSetting } from '../../scene-setting/interfaces/scene-setting.interface';
import { ISchedule } from '../../schedule/interfaces/schedule.interface';

export interface IScene {
  id: number;

  name?: string;

  protocolSceneId?: number;

  sceneSettings?: ISceneSetting[];

  floor?: IFloor;

  schedules?: ISchedule[];
}
