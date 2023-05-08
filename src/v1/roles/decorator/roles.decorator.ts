import { UserRole } from '../../users/user.const';
import { SetMetadata } from '@nestjs/common';


export const AuthRoles = (...roles: UserRole[]) => SetMetadata('roles', roles);
