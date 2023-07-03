import {
  IErrorResponse,
  ISuccessResponse,
} from '../../utils/interfaces/response.interface';
import { ChangePasswordDto } from './dto/change-password.dto';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseDto, ResponseGetDto } from '../../utils/dto/response.dto';
import { IRequest } from '../../utils/interfaces/request.interface';
import { ResponseService } from '../../utils/response.service';
import { AuthRoles } from '../roles/decorator/authRoles.decorator';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { DeleteMultipleAccountDto } from './dto/delete-multiple-account.dto';
import { CheckEmailDto, ParamUserDetailDto } from './dto/param-user.dto';
import { UpdateProfileAccountDto } from './dto/update-profile-account.dto';
import { UserRole } from './user.const';
import { UsersService } from './users.service';
import { BaseController } from '../../base/base-controller';

@ApiTags('Users')
export class UsersController extends BaseController{
  constructor(
    private readonly usersService: UsersService,
    private _res: ResponseService,
  ) {
    super(usersService)
  }

  /**
   * This method api register account super admin
   *
   * @body createSuperAdminDto CreateSuperAdminDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @Post('register/super-admin')
  @ApiOperation({ summary: 'This API register acount super-admin', description: 'This API register acount super-admin' })
  @ApiBody({ type: CreateSuperAdminDto })
  async createSuperAdmin(
    @Body() createSuperAdminDto: CreateSuperAdminDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const data = await this.usersService.createSuperAdmin(createSuperAdminDto);
    return this._res.success(data, 'SUCCESS');
  }

  /**
   * This method api register account admin
   *
   * @body createSuperAdminDto CreateSuperAdminDto
   * @returns ISuccessResponse | IErrorResponse
   */
  // api register account admin
  @AuthRoles(UserRole.SuperAdmin)
  // @AuthRules(UserRule.UserManagement)
  @Post('register/admin')
  @ApiOperation({ description: 'This API register acount admin' })
  @ApiBody({ type: CreateSuperAdminDto })
  async createAdmin(
    @Body() createAdminDto: CreateSuperAdminDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const data = await this.usersService.createAdmin(createAdminDto);
    return this._res.success(data);
  }

  /**
   * This API check email register
   *
   * @body email string
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin)
  // @AuthRules(UserRule.UserManagement)
  @Post('check-email')
  @ApiOperation({ description: 'This API check email register' })
  @ApiBody({ type: CheckEmailDto })
  async checkEmailExist(
    @Body() checkEmailDto: CheckEmailDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let email = checkEmailDto.email;
    const data = await this.usersService.checkEmailExist(email);
    return this._res.success({}, 'SUCCESS');
  }

  /**
   * This API get detail user
   *
   * @param params ParamUserDetailDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @ApiResponse({
    status: 404,
    description: 'Not found',
    type: ResponseGetDto,
  })
  // @AuthRules(UserRule.UserManagement)
  @Get(':id')
  @ApiOperation({ description: 'This API get detail user' })
  @ApiParam({ name: 'id', description: 'id of user' })
  async getDetailUsers(
    @Param() params: ParamUserDetailDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let id = params.id;
    let data = await this.usersService.getDetailUsers(id);
    return this._res.success(data, 'SUCCESS');
  }

  /**
   * This API get profile account
   *
   * @request req IRequest
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin, UserRole.User)
  @Get()
  @ApiOperation({ description: 'This API get profile user' })
  @ApiQuery({ name: 'id', description: 'id of user' })
  async getProfileAccount(
    @Request() req: IRequest,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let id = req.user.userId;
    let data = await this.usersService.getDetailUsers(id);
    return this._res.success(data, 'SUCCESS');
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
    return this._res.success(data, 'CHANGE_PASSWORD_SUCCESS');
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
    return this._res.success(data, 'CHANGE_PASSWORD_SUCCESS');
  }

  /**
   * This API update profile account
   *
   * @request req IRequest
   * @body updateProfileAccountDto UpdateProfileAccountDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
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
    return this._res.success(data, 'SUCCESS');
  }

  /**
   * This API multiple delete account
   *
   * @body deleteMultipleAccountDto deleteMultipleAccountDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  // @AuthRules(UserRule.UserManagement)
  @Put('delete-multiple-account')
  async deleteMultipleAccount(
    @Body() deleteMultipleAccountDto: DeleteMultipleAccountDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let data = await this.usersService.deleteMultipleAccount(
      deleteMultipleAccountDto,
    );
    return this._res.success(data, 'SUCCESS');
  }

  /**
   * This API delete account
   *
   * @param params ParamUserDetailDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @Delete('/:id')
  async deleteAccount(
    @Param() params: ParamUserDetailDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let id = params.id;
    let data = await this.usersService.deleteAccount(id);
    return this._res.success(data, 'SUCCESS');
  }

  /**
   * This API recover account
   *
   * @param params ParamUserDetailDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @Put('/:id')
  async recoverAccount(
    @Param() params: ParamUserDetailDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let id = params.id;
    let data = await this.usersService.recoverAccount(id);
    return this._res.success(data, 'SUCCESS');
  }
}
