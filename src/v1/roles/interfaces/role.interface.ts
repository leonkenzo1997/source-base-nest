import { IUser } from '../../users/interfaces/user.interface';

export interface IRole {
  id?: number;

  name?: string;

  users?: IUser[];

  createdAt?: Date;

  updatedAt?: Date;
}
