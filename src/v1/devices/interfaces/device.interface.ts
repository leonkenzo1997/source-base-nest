import { IBuilding } from '../../buildings/interfaces/building.interface';
import { IDeviceSetting } from '../../device-setting/interfaces/device-setting.interface';
import { IDeviceType } from '../../device-types/interfaces/device-types.interface';
import { IFloor } from '../../floors/interfaces/floor.interface';
import { IGroup } from '../../groups/interfaces/group.interface';
import { IZone } from '../../zones/interfaces/zone.interface';

export interface IDevice {
  id: number;

  name?: string;

  address?: string;

  bluetoothConnection?: boolean;

  lightingStatus?: boolean;

  timeActive?: Date;

  timeDeActive?: Date;

  deviceType?: IDeviceType;

  building?: IBuilding;

  floor?: IFloor;

  floorId?: number;

  zone?: IZone;

  zoneId?: number;

  group?: IGroup;

  groupId?: number;

  deletedAt?: Date;

  createdAt?: Date;

  updatedAt?: Date;

  protocolDeviceId?: number;

  positionGroup?: number;

  option?: string;

  secondGroup?: any;

  secondGroupId?: any;

  secondPositionGroup?: any;

  deviceSetting?: IDeviceSetting;

  deviceTypeId?: any;

  masterSensor?: boolean;
}
