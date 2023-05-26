import { Module, forwardRef } from '@nestjs/common';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersModule } from '../users/users.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh-token.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthenticationController],
  imports: [forwardRef(() => UsersModule), SessionsModule],
  providers: [AuthenticationService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
