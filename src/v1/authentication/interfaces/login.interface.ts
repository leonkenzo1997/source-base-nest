import { User } from '../../users/entities/user.entity';

export interface Login {
  userData: User;
  accessToken: string;
  refreshToken: string;
}
