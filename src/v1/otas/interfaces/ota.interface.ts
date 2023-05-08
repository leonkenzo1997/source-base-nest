// import { IDeviceType } from '../../device-types/interfaces/device-types.interface';
export interface IOta {
  id: number;

  version?: string;

  fileName?: string;

  note?: string;

  deviceType?: any;

  deletedAt?: Date;

  createdAt?: Date;

  updatedAt?: Date;
}
