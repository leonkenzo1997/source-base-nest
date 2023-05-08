import { IDeleteSchedule } from './../../schedule/interfaces/delete-schedule.interface';
import { IScene } from './../../scene/interfaces/scene.interface';
import { ISchedule } from '../../schedule/interfaces/schedule.interface';
import { IUserBuildingFloor } from '../../users-buildings-floors/interfaces/user-building-floor.interface';
import { IUser } from '../../users/interfaces/user.interface';
import { IZone } from '../../zones/interfaces/zone.interface';
import { IBuilding } from '../../buildings/interfaces/building.interface';
import { IDevice } from '../../devices/interfaces/device.interface';

export interface IFloor {
  id: number;

  name?: string;

  deleted?: boolean;

  deletedAt?: Date;

  createdAt?: Date;

  updatedAt?: Date;

  usersBuildingsFloors?: IUserBuildingFloor[];

  schedules?: ISchedule[];

  scene?: IScene[];

  provisionKey?: string;

  zones?: IZone[];

  building?: IBuilding;

  users?: IUser[];

  devices: IDevice[];

  deleteSchedule?: IDeleteSchedule[];
}
