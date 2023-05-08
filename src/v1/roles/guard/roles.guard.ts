import {
  CanActivate,
  ExecutionContext, ForbiddenException, Injectable, UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector, // @Inject(MessageBrokerService) // private messageBrokerService: MessageBrokerService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<number[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    // check api having token if api no token, it return error
    if (!user) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    // check Role
    const isAuthorized = roles.includes(
      user.roleId?.id ? user.roleId.id : user.roleId,
    );

    if (!isAuthorized) {
      throw new ForbiddenException('PERMISSION_DENIED');
    }

    return true;
  }
}
