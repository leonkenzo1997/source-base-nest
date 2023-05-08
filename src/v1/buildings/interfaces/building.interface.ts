import { IErrorLog } from '../../error-log/interfaces/error-log.interface';
import { IFloor } from '../../floors/interfaces/floor.interface';
import { IUserBuildingFloor } from '../../users-buildings-floors/interfaces/user-building-floor.interface';
import { IUserBuilding } from '../../users-buildings/interfaces/user-building.interface';
import { IUser } from '../../users/interfaces/user.interface';
import { IDevice } from '../../devices/interfaces/device.interface';
export interface IBuilding {
  id: number;

  name?: string;

  address?: string;

  status?: number;

  deleted?: boolean;

  deletedAt?: Date;

  createdAt?: Date;

  updatedAt?: Date;

  usersBuildings?: IUserBuilding[];

  usersBuildingsFloors?: IUserBuildingFloor[];

  createdBy?: IUser;

  errors?: IErrorLog[];

  users?: IUser[];

  floors?: IFloor[];

  devices?: IDevice[];
}
