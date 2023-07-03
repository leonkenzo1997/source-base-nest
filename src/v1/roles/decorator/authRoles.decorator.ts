import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import {
  ResponseAuthorizedDto
} from './../../../utils/dto/response.dto';
import { UserRole } from './../../users/user.const';
import { Roles } from './roles.decorator';

export function AuthRoles(...role: UserRole[]) {
  let roles: any;
  if (typeof role === 'string') roles = [role];
  else roles = role;
  return applyDecorators(
    Roles(...roles),
    ApiBearerAuth('accessToken'),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: ResponseAuthorizedDto,
    }),
  );
}
