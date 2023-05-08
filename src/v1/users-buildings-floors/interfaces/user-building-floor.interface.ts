import { IUser } from '../../users/interfaces/user.interface';
import { IBuilding } from '../../buildings/interfaces/building.interface';
import { IFloor } from '../../floors/interfaces/floor.interface';

export interface IUserBuildingFloor {
  id?: number;

  user?: IUser;

  building: IBuilding;

  floor: IFloor;

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date;
}
