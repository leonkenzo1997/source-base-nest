import { IOta } from '../../otas/interfaces/ota.interface';
import { IBuilding } from '../../buildings/interfaces/building.interface';
import { IDevice } from '../../devices/interfaces/device.interface';
import { IUser } from '../../users/interfaces/user.interface';

export interface IDeviceType {
  id: number;

  type?: string;

  deletedAt?: Date;

  createdAt?: Date;

  updatedAt?: Date;

  otas?: IOta[];

  building?: IBuilding;

  users?: IUser[];

  devices?: IDevice[];
}
