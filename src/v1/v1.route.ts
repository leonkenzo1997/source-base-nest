/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { AuthenticationModule } from './authentication/authentication.module';
import { RolesModule } from './roles/roles.module';
import { RulesModule } from './rules/rules.module';
import { TestModule } from './test/test.module';
import { UsersModule } from './users/users.module';

const routes: Routes = [
  {
    path: 'v1',
    children: [
      { path: 'authentication', module: AuthenticationModule },
      { path: 'users', module: UsersModule },
      { path: 'roles', module: RolesModule },
      { path: 'rules', module: RulesModule },
      { path: 'test', module: TestModule },
    ],
  },
];

@Module({
  imports: [RouterModule.register(routes)],
  exports: [RouterModule],
})
export class V1Route {}
