import {
  IErrorResponse,
  ISuccessResponse,
} from '../../interfaces/response.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { IRequest } from '../../interfaces/request.interface';
import { ResponseService } from '../../utils/response.service';
import { AuthRoles } from '../roles/decorator/roles.decorator';
import { AuthRules } from '../rules/decorator/rules.decorator';
import { UserRule } from '../rules/rule.const';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { DeleteMultipleAccountDto } from './dto/delete-multiple-account.dto';
import { GetListUserByBuildingIdDto } from './dto/get-list-user-by-buidling.dto';
import { ParamUserDetailDto } from './dto/param-user.dto';
import { UpdateProfileAccountDto } from './dto/update-profile-account.dto';
import { UserRole } from './user.const';
import { UsersService } from './users.service';

@Controller()
// @AuthRules(UserRule.UserManagement)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private res: ResponseService,
  ) {}

  /**
   * This method api register account super admin
   *
   * @body createSuperAdminDto CreateSuperAdminDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @Post('register/super-admin')
  async createSuperAdmin(
    @Body() createSuperAdminDto: CreateSuperAdminDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const data = await this.usersService.createSuperAdmin(createSuperAdminDto);
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API register account admin
   *
   * @body createAdminDto CreateUserDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin)
  @AuthRules(UserRule.UserManagement)
  @Post('register/account')
  async createAccount(
    @Body() createAdminDto: CreateUserDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const data = await this.usersService.createAccount(createAdminDto);
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API check email register
   *
   * @body email string
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin)
  @AuthRules(UserRule.UserManagement)
  @Post('check-email')
  async checkEmailExist(
    @Body('email') email: string,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const data = await this.usersService.checkEmailExist(email);
    return this.res.success({}, 'SUCCESS');
  }

  /**
   * This API for get list user account by building
   *
   * @query getListUserByBuildingIdDto getListUserByBuildingIdDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.SuperAdmin)
  @AuthRules(UserRule.UserManagement)
  @Get('get-list-account-by-building-id/user')
  public async getListUsersByBuildingId(
    @Query() getListUserByBuildingIdDto: GetListUserByBuildingIdDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const data = await this.usersService.getListUsersByBuildingId(
      getListUserByBuildingIdDto,
    );
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API for get list admin account by building
   *
   * @request req IRequest
   * @query getListUserByBuildingIdDto getListUserByBuildingIdDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.SuperAdmin)
  @AuthRules(UserRule.UserManagement)
  @Get('get-list-account-by-building-id/admin')
  public async getListAdminsByBuildingId(
    @Request() req: IRequest,
    @Query() getListUserByBuildingIdDto: GetListUserByBuildingIdDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const data = await this.usersService.getListAdminsByBuildingId(
      user,
      getListUserByBuildingIdDto,
    );
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API get detail user
   *
   * @param params ParamUserDetailDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @AuthRules(UserRule.UserManagement)
  @Get(':id')
  async getDetailUsers(
    @Param() params: ParamUserDetailDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let id = params.id;
    let data = await this.usersService.getDetailUsers(id);
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API get profile account
   *
   * @request req IRequest
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin, UserRole.User)
  @Get()
  async getProfileAccount(
    @Request() req: IRequest,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let id = req.user.userId;
    let data = await this.usersService.getDetailUsers(id);
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API change password user
   *
   * @param params ParamUserDetailDto
   * @body changePasswordDto ChangePasswordDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @Put('change-password/:id')
  async changePassword(
    @Param() params: ParamUserDetailDto,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let id = params.id;
    let data = await this.usersService.changePasswordProfile(
      id,
      changePasswordDto,
    );
    return this.res.success(data, 'CHANGE_PASSWORD_SUCCESS');
  }

  /**
   * This API change password profile
   *
   * @request req IRequest
   * @body changePasswordDto ChangePasswordDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin, UserRole.User)
  @Put('change-password')
  async changePasswordProfile(
    @Request() req: IRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let id = req.user.userId;
    let data = await this.usersService.changePasswordProfile(
      id,
      changePasswordDto,
    );
    return this.res.success(data, 'CHANGE_PASSWORD_SUCCESS');
  }

  // api update account
  // @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  // @Put('/:id')
  // async updateAccount(
  //   @Param('id') id: number,
  //   @Body() updateProfileAccountDto: UpdateProfileAccountDto,
  // ): Promise<ISuccessResponse | IErrorResponse> {
  //   let data = await this.usersService.updateAccount(
  //     id,
  //     updateProfileAccountDto,
  //   );
  //   return this.res.success(data, 'SUCCESS');
  // }

  /**
   * This API update profile account
   *
   * @request req IRequest
   * @body updateProfileAccountDto UpdateProfileAccountDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @AuthRules(UserRule.UserManagement)
  @Put()
  async updateProfileAccount(
    @Request() req: IRequest,
    @Body() updateProfileAccountDto: UpdateProfileAccountDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let user = req.user;
    let id = user.userId;
    let data = await this.usersService.updateProfileAccount(
      id,
      updateProfileAccountDto,
    );
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API multiple delete account
   *
   * @body deleteMultipleAccountDto deleteMultipleAccountDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @AuthRules(UserRule.UserManagement)
  @Put('delete-multiple-account')
  async deleteMultipleAccount(
    @Body() deleteMultipleAccountDto: DeleteMultipleAccountDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let data = await this.usersService.deleteMultipleAccount(
      deleteMultipleAccountDto,
    );
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API delete account
   *
   * @param params ParamUserDetailDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @AuthRules(UserRule.UserManagement)
  @Delete('/:id')
  async deleteAccount(
    @Param() params: ParamUserDetailDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let id = params.id;
    let data = await this.usersService.deleteAccount(id);
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API recover account
   *
   * @param params ParamUserDetailDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @AuthRules(UserRule.UserManagement)
  @Put('/:id')
  async recoverAccount(
    @Param() params: ParamUserDetailDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let id = params.id;
    let data = await this.usersService.recoverAccount(id);
    return this.res.success(data, 'SUCCESS');
  }
}
