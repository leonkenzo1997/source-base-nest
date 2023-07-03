import { AuthenticationModule } from './authentication/authentication.module';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { RulesModule } from './rules/rules.module';
import { SessionsModule } from './sessions/sessions.module';
import { TestModule } from './test/test.module';
import { UsersRulesModule } from './users-rules/users-rules.module';
import { UsersModule } from './users/users.module';
import { V1Route } from './v1.route';

@Module({
  imports: [
    V1Route,
    UsersModule,
    SessionsModule,
    RolesModule,
    AuthenticationModule,
    RulesModule,
    TestModule,
    UsersRulesModule,
  ],
  controllers: [],
  providers: [],
})
export class V1Module {}
