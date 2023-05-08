import { IRule } from '../../rules/interfaces/rules.interface';
import { IUser } from '../../users/interfaces/user.interface';

export interface IUserRule {
  id?: number;

  user?: IUser;

  rule?: IRule;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date;
}
