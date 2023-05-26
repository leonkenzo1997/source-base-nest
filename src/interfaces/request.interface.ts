import { UserRule } from '../v1/rules/rule.const';
import { UserRole } from '../v1/users/user.const';
import { IJwt } from './../v1/authentication/interfaces/jwt.interface';

export interface IReqUser extends IJwt {
  userId: number;
  sessionId: number;
  roleId: UserRole;
  rules: UserRule[];
}

export interface IRequest {
  user: IReqUser;
}

export interface IQuery {
  page: number;
  limit: number;
  order: any;
}
