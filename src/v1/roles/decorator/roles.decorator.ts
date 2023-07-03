import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/user.const';

export const Roles = (...roles: UserRole[]) => {
return SetMetadata('roles', roles);
};

// export function Auth(role?: UserRole | UserRole[]) {
//     let roles = [];
//     if (typeof role === 'string') roles = [role];
//     else roles = role;
//     return applyDecorators(AuthRoles(...roles), ApiBearerAuth('accessToken'), ApiUnauthorizedResponse({ description: 'Unauthorized' }));
//   }
