import { IUser } from '../../users/interfaces/user.interface';

export interface ISession {
  id: number;

  status?: number;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date;

  user: IUser;
}
