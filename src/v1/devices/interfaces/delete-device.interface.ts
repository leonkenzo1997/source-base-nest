import { IFloor } from '../../floors/interfaces/floor.interface';
import { IGroup } from '../../groups/interfaces/group.interface';
import { IZone } from '../../zones/interfaces/zone.interface';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export interface IDeleteDevice {
  id: number;

  floor?: IFloor;

  floorId?: number;

  zone?: IZone;

  zoneId?: number;

  group?: IGroup;

  groupId?: number;

  protocolDeviceId?: number;

  deletedAt?: Date;

  createdAt?: Date;

  updatedAt?: Date;
}
