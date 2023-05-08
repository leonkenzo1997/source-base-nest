import { Controller, Get, Query } from '@nestjs/common';
import { AuthRoles } from '../roles/decorator/roles.decorator';
import { AuthRules } from '../rules/decorator/rules.decorator';
import { UserRule } from '../rules/rule.const';
import { UserRole } from '../users/user.const';
import {
  IErrorResponse,
  ISuccessResponse,
} from '../../interfaces/response.interface';
import { ResponseService } from '../../utils/response.service';
import { GetUserBuildingDto } from './dto/get-users-buildings.dto';
import { UserBuildingService } from './users-buildings.service';

@Controller()
export class UserBuildingController {
  constructor(
    private readonly userBuildingService: UserBuildingService,
    private res: ResponseService,
  ) {}

  /**
   * This API is get account admin by id building
   *
   * @query getUserBuildingDto GetUserBuildingDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @Get('admin')
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @AuthRules(UserRule.UserManagement)
  public async getAdminAccountByBuilding(
    @Query() getUserBuildingDto: GetUserBuildingDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let data = await this.userBuildingService.getAdminAccountByBuilding(
      getUserBuildingDto,
    );
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API is get account user by id building
   *
   * @query getUserBuildingDto GetUserBuildingDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @Get('user')
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @AuthRules(UserRule.UserManagement)
  async getAccountUserByBuilding(
    @Query() getUserBuildingDto: GetUserBuildingDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let data = await this.userBuildingService.getUserAccountByBuilding(
      getUserBuildingDto,
    );
    return this.res.success(data, 'SUCCESS');
  }
}
