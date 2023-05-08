import {
  Controller, Get, Query
} from '@nestjs/common';
import { AuthRoles } from '../roles/decorator/roles.decorator';
import { AuthRules } from '../rules/decorator/rules.decorator';
import { UserRule } from '../rules/rule.const';
import { UserRole } from '../users/user.const';
import {
  IErrorResponse,
  ISuccessResponse
} from '../../interfaces/response.interface';
import { ResponseService } from '../../utils/response.service';
import { GetUserBuildingFloorByBuildingIdDto } from './dto/get-users-buildings-floors-by-building-id.dto';
import { UsersBuildingsFloorsService } from './users-buildings-floors.service';

@Controller()
export class UsersBuildingsFloorsController {
  constructor(
    private readonly usersBuildingsFloorsService: UsersBuildingsFloorsService,
    private res: ResponseService,
  ) {}

  // @Get('admin')
  // @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  // @AuthRules(UserRule.UserManagement)
  // async getAdminAccountByBuilding(
  //   @Query() getUserBuildingFloorByBuildingIdDto: GetUserBuildingFloorByBuildingIdDto,
  // ): Promise<ISuccessResponse | IErrorResponse> {
  //   let data = await this.usersBuildingsFloorsService.getAdminAccountByBuilding(
  //     getUserBuildingFloorByBuildingIdDto,
  //   );
  //   return this.res.success(data, 'SUCCESS');
  // }

  // @Get('user')
  // @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  // @AuthRules(UserRule.UserManagement)
  // async getAccountUserByBuilding(
  //   @Query() getUserBuildingFloorByBuildingIdDto: GetUserBuildingFloorByBuildingIdDto,
  // ): Promise<ISuccessResponse | IErrorResponse> {
  //   let data = await this.usersBuildingsFloorsService.getUserAccountByBuilding(
  //     getUserBuildingFloorByBuildingIdDto,
  //   );
  //   return this.res.success(data, 'SUCCESS');
  // }
}
