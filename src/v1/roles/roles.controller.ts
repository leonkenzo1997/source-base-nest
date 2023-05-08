/* eslint-disable prettier/prettier */
import {
  IErrorResponse,
  ISuccessResponse,
} from '../../interfaces/response.interface';
import { ResponseService } from '../../utils/response.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';
import { GetRoleDto } from './dto/get-role.dto';
import { AuthRoles } from './decorator/roles.decorator';
import { UserRole } from '../users/user.const';
import { ParamRoleDetailDto } from './dto/params-role.dto';

@Controller()
export class RolesController {
  constructor(
    private rolesService: RolesService,
    private res: ResponseService,
  ) {}

  /**
   * This API is create new role
   *
   * @body createRoleDto CreateRoleDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin)
  @Post('create')
  async createRole(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const results = await this.rolesService.createRoles(createRoleDto);
    return this.res.success(results);
  }

  /**
   * This API get detail role
   *
   * @param param ParamRoleDetailDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @Get(':id')
  async getDetail(
    @Param() param: ParamRoleDetailDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const id = param.id;
    const results = await this.rolesService.getDetail(id);
    return this.res.success(results);
  }

  /**
   * This API is get list role
   *
   * @query getRoleDto GetRoleDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @Get()
  async getList(
    @Query() getRoleDto: GetRoleDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const results = await this.rolesService.getList(getRoleDto);
    return this.res.success(results);
  }

  /**
   * This API update role
   *
   * @param param ParamRoleDetailDto
   * @body updateRoleDto UpdateRoleDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin)
  @Patch(':id')
  async updateRole(
    @Param() param: ParamRoleDetailDto,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const id = param.id;
    const results = await this.rolesService.updateRole(id, updateRoleDto);
    return this.res.success(results);
  }
}
