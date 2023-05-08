import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SessionsService } from '../../sessions/sessions.service';
import { IJwt } from '../interfaces/jwt.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private sessionsService: SessionsService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshTokenSecret'),
    });
  }

  async validate(token): Promise<IJwt> {
    const cache = await this.cacheManager.get(String(token.sessionId));
    if (!cache) {
      const session = await this.sessionsService.findActiveSessionById(
        token.sessionId,
      );

      // if (!session) {
      //   return null;
      // }

      await this.cacheManager.set(String(session.id), 1, {
        ttl: 300,
      });
    }

    let data: IJwt = {
      userId: token.userId,
      sessionId: token.sessionId,
      roleId: token.roleId,
      rules: token.rules,
    };

    return data;
  }
}
