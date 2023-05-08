import { IUserRule } from '../../users-rules/interfaces/user-rule.interface';

import { IFloor } from '../../floors/interfaces/floor.interface';

export interface IRule {
  id?: number;

  name?: string;

  users?: IUserRule[];

  createdAt?: Date;

  updatedAt?: Date;
}
