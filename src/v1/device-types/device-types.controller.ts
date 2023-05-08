import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  IErrorResponse,
  ISuccessResponse,
} from '../../interfaces/response.interface';
import { ResponseService } from '../../utils/response.service';
import { AuthRoles } from '../roles/decorator/roles.decorator';
import { AuthRules } from '../rules/decorator/rules.decorator';
import { UserRule } from '../rules/rule.const';
import { UserRole } from '../users/user.const';
import { DeviceTypesService } from './device-types.service';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { GetDeviceTypeDto } from './dto/get-device-type.dto';
import { ParamDeviceTypeDetailDto } from './dto/param-device-type.dto';
import { UpdateDeviceTypeDto } from './dto/update-device-type.dto';

@Controller()
export class DeviceTypesController {
  constructor(
    private readonly deviceTypesService: DeviceTypesService,
    private res: ResponseService,
  ) {}

  /**
   * This API get list device type
   *
   * @query getDeviceTypeDto GetDeviceTypeDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @AuthRules(UserRule.DeviceManagement)
  @Get()
  public async listDeviceType(
    @Query() getDeviceTypeDto: GetDeviceTypeDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const results = await this.deviceTypesService.getList(getDeviceTypeDto);
    return this.res.success(results);
  }

  /**
   * This API create new device type
   *
   * @body createDeviceTypeDto CreateDeviceTypeDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @AuthRules(UserRule.DeviceManagement)
  @Post()
  public async createDeviceTypes(
    @Body() createDeviceTypeDto: CreateDeviceTypeDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const results = await this.deviceTypesService.createDeviceType(
      createDeviceTypeDto,
    );
    return this.res.success(results, 'SUCCESS');
  }

  /**
   * This API is get detail data of device type
   *
   * @param params ParamDeviceTypeDetailDto,
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @AuthRules(UserRule.DeviceManagement)
  @Get(':id')
  public async getDetail(
    @Param() params: ParamDeviceTypeDetailDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let id = params.id;
    const results = await this.deviceTypesService.findbyId(id);
    return this.res.success(results, 'SUCCESS');
  }

  /**
   * This API: update data of device type
   *
   * @param params ParamDeviceTypeDetailDto,
   * @body updateDeviceTypeDto UpdateDeviceTypeDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @AuthRules(UserRule.DeviceManagement)
  @Put(':id')
  public async updateDeviceType(
    @Param() params: ParamDeviceTypeDetailDto,
    @Body() updateDeviceTypeDto: UpdateDeviceTypeDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let id = params.id;
    const results = await this.deviceTypesService.updateDeviceType(
      id,
      updateDeviceTypeDto,
    );
    return this.res.success(results, 'SUCCESS');
  }
}
