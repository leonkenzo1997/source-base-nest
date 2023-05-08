import { IFloor } from '../../floors/interfaces/floor.interface';
import { ScheduleType } from '../schedule.const';
import { IScene } from '../../scene/interfaces/scene.interface';
import { IUser } from '../../users/interfaces/user.interface';
import { IBuilding } from "../../buildings/interfaces/building.interface";

export interface ISchedule {
  id?: number;

  name?: string;

  type?: ScheduleType;

  hours?: number;

  minutes?: number;

  dayOfWeek?: number;

  date?: number;

  months?: number;

  years?: number;

  scene?: IScene;

  floor?: IFloor;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date;

  protocolScheduleId?: number;

  createdBy?: IUser;

  building?: IBuilding;

  buildingId?: number;
}
