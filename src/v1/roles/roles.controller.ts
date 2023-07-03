import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AttachIdDto } from '../../utils/dto/params.dto';
import { UserRole } from '../users/user.const';
import {
  IErrorResponse,
  ISuccessResponse,
} from '../../utils/interfaces/response.interface';
import { ResponseService } from './../../utils/response.service';
import { AuthRoles } from './decorator/authRoles.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetRoleDto } from './dto/get-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';
import { BaseController } from '../../base/base-controller';

@ApiTags('Roles')
@Controller()
export class RolesController {
  constructor(
    private _rolesService: RolesService,
    private _res: ResponseService,
  ) {
    // super(_rolesService)
  }

  /**
   * This API account create role
   *
   * @body createRoleDto CreateRoleDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin)
  @Post('create')
  @ApiOperation({ description: 'This API create role' })
  @ApiBody({ type: CreateRoleDto })
  async createRole(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const results = await this._rolesService.createRoles(createRoleDto);
    return this._res.success(results);
  }

  /**
   *  This API get detail role
   *
   * @Param id number
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'id of role',
    required: true,
    type: 'number',
  })
  // example about multiple params for swagger
  @ApiParam({ name: 'id', description: 'id of role', required: true, type: 'string' })
  @ApiOperation({ description: 'This API get detail role' })
  async getDetail(
    @Param() params: AttachIdDto,
    // example about multiple params for swagger
    // @Param('name') name: string,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let id = params.id;
    const results = await this._rolesService.getDetail(id);
    return this._res.success(results);
  }

  /**
   *  This API get list role
   *
   * @Query getRoleDto GetRoleDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @ApiOperation({ description: 'This API get list role' })
  @Get()
  // example swagger about query (multiple field)
  // @ApiQuery({
  //   name: 'limit',
  //   description: 'limit of list of roles. default : 10',
  //   required: false,
  //   type: 'number',
  // })
  // @ApiQuery({
  //   name: 'page',
  //   description: 'page of list of roles. default : 1',
  //   required: false,
  //   type: 'number',
  // })
  async getList(
    @Query() getRoleDto: GetRoleDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const results = await this._rolesService.getList(getRoleDto);
    return this._res.success(results);
  }

   /**
   *  This API update data of role
   *
   * @Param params AttachIdDto
   * @Body updateRoleDto UpdateRoleDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin)
  @Patch(':id')
  @ApiOperation({ description: 'This API update data of role' })
  @ApiParam({ name: 'id', description: 'id of role', required: true })
  async updateRole(
    @Param() params: AttachIdDto,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let id = params.id;
    const results = await this._rolesService.updateRole(id, updateRoleDto);
    return this._res.success(results);
  }
}
