import { IGroup } from 'src/v1/groups/interfaces/group.interface';
import { IZone } from 'src/v1/zones/interfaces/zone.interface';
import { ISceneSetting } from '../../scene-setting/interfaces/scene-setting.interface';

export class ISceneSettingArea {
  id: number;

  sceneSetting?: ISceneSetting;

  floorId?: number;

  zoneId?: number;

  groupId?: number;

  group?: IGroup;

  zone?: IZone;

  deletedAt?: Date;

  createdAt?: Date;

  updatedAt?: Date;
}
