import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { BuildingsModule } from './buildings/buildings.module';
import { DeviceTypesModule } from './device-types/device-types.module';
import { ErrorLogModule } from './error-log/error-log.module';
import { FloorsModule } from './floors/floors.module';
import { GroupsModule } from './groups/groups.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { InformationCompanyModule } from './information-company/information-company.module';
import { OtasModule } from './otas/otas.module';
import { RolesModule } from './roles/roles.module';
import { RulesModule } from './rules/rules.module';
import { SceneSettingAreaModule } from './scene-setting-area/scene-setting-area.module';
import { SceneSettingModule } from './scene-setting/scene-setting.module';
import { SceneModule } from './scene/scene.module';
import { ScheduleModule } from './schedule/schedule.module';
import { SessionsModule } from './sessions/sessions.module';
import { TestModule } from './test/test.module';
import { UserBuildingFloorModule } from './users-buildings-floors/users-buildings-floors.module';
import { UsersBuildingsModule } from './users-buildings/users-buildings.module';
import { UsersRulesModule } from './users-rules/users-rules.module';
import { UsersModule } from './users/users.module';
import { V1Route } from './v1.route';
import { ZonesModule } from './zones/zones.module';
import { CrontabModule } from './crontab/crontab.module';
import { DevicesModule } from './devices/devices.module';
import { DeviceSettingModule } from './device-setting/device-setting.module';
import { GroupSetting } from './groups/entities/group-setting.entity';
import { IotHubModule } from './iot-hub/iot-hub.module';

@Module({
  imports: [
    V1Route,
    UsersModule,
    SessionsModule,
    RolesModule,
    AuthenticationModule,
    TestModule,
    RulesModule,
    FloorsModule,
    BuildingsModule,
    UsersRulesModule,
    UsersBuildingsModule,
    UserBuildingFloorModule,
    OtasModule,
    ZonesModule,
    HealthCheckModule,
    GroupsModule,
    DeviceTypesModule,
    ErrorLogModule,
    InformationCompanyModule,
    ScheduleModule,
    SceneSettingAreaModule,
    SceneModule,
    SceneSettingModule,
    CrontabModule,
    DevicesModule,
    DeviceSettingModule,
    IotHubModule,
  ],
  controllers: [],
  providers: [],
})
export class V1Module {}
