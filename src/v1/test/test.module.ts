import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CronService } from '../../cron/cron.service';
import { CrontabModule } from '../crontab/crontab.module';
import { RulesModule } from '../rules/rules.module';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersModule } from '../users/users.module';
import { TestController } from './test.controller';
import { TestService } from './test.service';
// import { RolesModule } from './../roles/roles.module';

@Module({
  imports: [
    UsersModule,
    SessionsModule,
    RulesModule,
    CrontabModule,
    HttpModule,
  ],
  controllers: [TestController],
  providers: [TestService, CronService],
  exports: [TestService],
})
export class TestModule {}
