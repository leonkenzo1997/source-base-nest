import { IFloor } from '../../floors/interfaces/floor.interface';

export interface IDeleteSchedule {
  id?: number;

  protocolScheduleId?: number;
  
  floor?: IFloor;
}
