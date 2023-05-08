import { IZone } from './../../zones/interfaces/zone.interface';
export interface IDeleteGroup {
  id: number;

  protocolGroupId?: number;

  zone?: IZone;
}
