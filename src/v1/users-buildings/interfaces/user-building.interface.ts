import { IBuilding } from '../../buildings/interfaces/building.interface';
import { IUser } from '../../users/interfaces/user.interface';

export interface IUserBuilding {
  id?: number;

  user?: IUser;

  building?: IBuilding;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date;
}
