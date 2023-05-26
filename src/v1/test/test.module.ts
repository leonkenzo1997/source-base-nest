import { Module } from '@nestjs/common';
import { SessionsModule } from '../sessions/sessions.module';
import { SessionsService } from '../sessions/sessions.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { TestController } from './test.controller';
import { TestService } from './test.service';
// import { RolesModule } from './../roles/roles.module';

@Module({
  imports: [UsersModule, SessionsModule],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
