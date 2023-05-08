import { IUserBuildingFloor } from '../../users-buildings-floors/interfaces/user-building-floor.interface';
import { IUserBuilding } from '../../users-buildings/interfaces/user-building.interface';
import { IUserRule } from '../../users-rules/interfaces/user-rule.interface';
import { UserGender, UserStatus } from '../user.const';
import { IBuilding } from '../../buildings/interfaces/building.interface';
import { IRole } from '../../roles/interfaces/role.interface';
import { ISession } from '../../sessions/interfaces/session.interface';

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

  buildings?: IBuilding[];

  usersBuildings?: IUserBuilding[];

  usersBuildingsFloors?: IUserBuildingFloor[];

  rules?: IUserRule[];

  isSaved?: boolean;

  loginAccessTime?: Date;

  lastActiveTime?: Date;

  building?: any;

  floors?: any[];

  buildingId?: any;
}
