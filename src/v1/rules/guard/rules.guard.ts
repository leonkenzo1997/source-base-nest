import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RulesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rules = this.reflector.get<number[]>('rules', context.getHandler());
    if (!rules) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    // check api having token if api no token, it return error
    if (!user) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    // check Rule
    const isAuthorized = user.rules.some((item: any) => rules.includes(item.rule.id));

    if (!isAuthorized) {
      throw new HttpException('PERMISSION_DENIED', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
