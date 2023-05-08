import { IFloor } from '../../floors/interfaces/floor.interface';

export interface IDeleteZone {
  id: number;

  protocolZoneId: number;

  floor?: IFloor;

  floorId?: number;

  buildingId?: number;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date;
}
