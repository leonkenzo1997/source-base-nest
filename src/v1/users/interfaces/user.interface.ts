import { IRole } from '../../roles/interfaces/role.interface';
import { ISession } from '../../sessions/interfaces/session.interface';
import { IUserRule } from '../../users-rules/interfaces/user-rule.interface';
import { UserGender, UserStatus } from '../user.const';

export interface IUser {
  id: number;

  status?: UserStatus;

  email?: string;

  userName?: string;

  fullName?: string;

  phoneNumber?: string;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date;

  gender?: UserGender;

  emailContact?: string;

  sessions?: ISession[];

  role?: IRole;

  rules?: IUserRule[];

  isSaved?: boolean;

  loginAccessTime?: Date;

  lastActiveTime?: Date;
}
