import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { AuthenticationModule } from './authentication/authentication.module';
import { BuildingsModule } from './buildings/buildings.module';
import { DeviceSettingModule } from './device-setting/device-setting.module';
import { DeviceTypesModule } from './device-types/device-types.module';
import { DevicesModule } from './devices/devices.module';
import { ErrorLogModule } from './error-log/error-log.module';
import { FloorsModule } from './floors/floors.module';
import { GroupsModule } from './groups/groups.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { InformationCompanyModule } from './information-company/information-company.module';
import { IotHubModule } from './iot-hub/iot-hub.module';
import { OtasModule } from './otas/otas.module';
import { RolesModule } from './roles/roles.module';
import { RulesModule } from './rules/rules.module';
import { SceneSettingAreaModule } from './scene-setting-area/scene-setting-area.module';
import { SceneSettingModule } from './scene-setting/scene-setting.module';
import { SceneModule } from './scene/scene.module';
import { ScheduleModule } from './schedule/schedule.module';
import { TestModule } from './test/test.module';
import { UsersModule } from './users/users.module';
import { ZonesModule } from './zones/zones.module';

const routes: Routes = [
  {
    path: 'v1',
    children: [
      { path: 'authentication', module: AuthenticationModule },
      { path: 'users', module: UsersModule },
      { path: 'roles', module: RolesModule },
      { path: 'rules', module: RulesModule },
      { path: 'test', module: TestModule },
      { path: 'floors', module: FloorsModule },
      { path: 'buildings', module: BuildingsModule },
      { path: 'zones', module: ZonesModule },
      { path: 'groups', module: GroupsModule },
      { path: 'otas', module: OtasModule },
      { path: 'device-type', module: DeviceTypesModule },
      { path: 'error-log', module: ErrorLogModule },
      { path: 'scenes', module: SceneModule },
      { path: 'scene-settings', module: SceneSettingModule },
      { path: 'scene-setting-areas', module: SceneSettingAreaModule },
      { path: 'information-company', module: InformationCompanyModule },
      { path: 'health-check', module: HealthCheckModule },
      { path: 'schedules', module: ScheduleModule },
      { path: 'devices', module: DevicesModule },
      { path: 'device-setting', module: DeviceSettingModule },
      { path: 'iot-hub', module: IotHubModule },
    ],
  },
];

@Module({
  imports: [RouterModule.register(routes)],
  exports: [RouterModule],
})
export class V1Route {}
