import { IDevice } from '../../devices/interfaces/device.interface';
import { IFloor } from '../../floors/interfaces/floor.interface';
import { IGroup } from '../../groups/interfaces/group.interface';
import { IUserBuildingFloor } from '../../users-buildings-floors/interfaces/user-building-floor.interface';
import { IUser } from '../../users/interfaces/user.interface';
import { IBuilding } from '../../buildings/interfaces/building.interface';

export interface IZone {
  id: number;

  name?: string;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date;

  floor?: IFloor;

  groups?: IGroup[];

  buildingId?: number;

  usersBuildingsFloors?: IUserBuildingFloor[];

  building?: IBuilding;

  users?: IUser[];

  devices?: IDevice[];

  protocolZoneId?: number;

  protocolId?: number;
}
