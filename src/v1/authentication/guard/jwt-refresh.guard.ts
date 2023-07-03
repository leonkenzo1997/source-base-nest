import { ResponseGetDto } from './../../../utils/dto/response.dto';
import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard('jwt-refresh') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  handleRequest(err, user, info) {
    if (err || !user) {
      throw new HttpException('SESSION_EXPIRED', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
