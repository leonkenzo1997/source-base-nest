import { IDevice } from '../../devices/interfaces/device.interface';

export interface IDeviceSetting {
  id: number;

  brightness?: number;

  tone?: number;

  deletedAt?: Date;

  createdAt?: Date;

  updatedAt?: Date;

  device?: IDevice;

  fadeInTime?: number;

  fadeOutTime?: number;

  sensorSensitivity?: number;

  brightnessRetentionTime?: number;

  recognizingCycleTime?: number;

  perception?: number;

  notPerception?: number;
}
