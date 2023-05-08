import { IDeviceSetting } from '../../device-setting/interfaces/device-setting.interface';
import { IDevice } from '../../devices/interfaces/device.interface';

import { IZone } from '../../zones/interfaces/zone.interface';

export interface IGroup {
  id: number;

  name?: string;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date;

  zone?: IZone;

  buildingId?: number;

  floorId?: number;

  devices?: IDevice[];

  protocolGroupId?: number;

  buttonPosition?: string;

  groupSetting?: any;

  sensorSetting?: IDeviceSetting;

  masterSensor?: IDevice;

  protocolId?: number;
}
