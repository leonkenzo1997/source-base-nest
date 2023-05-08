import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request
} from '@nestjs/common';
import { AttachIdDto } from '../../dto/params.dto';
import { IRequest } from '../../interfaces/request.interface';
import {
  IErrorResponse,
  ISuccessResponse
} from '../../interfaces/response.interface';
import { ResponseService } from '../../utils/response.service';
import { UpdateIndicatorModeDto } from '../device-setting/dto/body-device-setting.dto';
import { AuthRoles } from '../roles/decorator/roles.decorator';
import { AuthRules } from '../rules/decorator/rules.decorator';
import { UserRule } from '../rules/rule.const';
import { UserRole } from '../users/user.const';
import { CreateGroupsDto } from './dto/create-group.dto';
import {
  GetListGroupByZoneArrayDto,
  GetListGroupsDto
} from './dto/get-groups.dto';
import {
  ParamGroupDetailDto,
  ParamGroupZoneIdDto
} from './dto/params-groups.dto';
import { UpdateButtonPositionDto } from './dto/update-button-position.dto';
import {
  UpdateGroupLightOptimizationModeDto,
  UpdateGroupsDto,
  UpdateGroupSensorSettingDto,
  UpdateGroupSettingDto
} from './dto/update-group.dto';
import { GroupsService } from './groups.service';

@Controller()
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private res: ResponseService,
  ) {}

  /**
   * This API create new group
   *
   * @request req IRequest
   * @body createGroupsDto CreateGroupsDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Post('create')
  async createGroup(
    @Request() req: IRequest,
    @Body() createGroupsDto: CreateGroupsDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const results = await this.groupsService.createGroups(
      user,
      createGroupsDto,
    );
    return this.res.success(results);
  }

  /**
   * This API get detail group
   *
   * @param params ParamGroupDetailDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.User)
  @Get(':id')
  async getDetail(
    @Param() params: ParamGroupDetailDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const id = params.id;
    const results = await this.groupsService.getDetail(id);
    return this.res.success(results);
  }

  /**
   * This API get list group of zone (mobile)
   *
   * @request req IRequest
   * @query getListGroupsDto GetListGroupsDto
   * @param params ParamGroupZoneIdDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.User)
  @Get('list/:zoneId')
  async getList(
    @Request() req: IRequest,
    @Query() getListGroupsDto: GetListGroupsDto,
    @Param() params: ParamGroupZoneIdDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const zoneId = params.zoneId;
    const results = await this.groupsService.getList(
      zoneId,
      user,
      getListGroupsDto,
    );
    return this.res.success(results);
  }

  /**
   * This API get list group of zone (web admin)
   *
   * @request req IRequest
   * @query getListGroupsDto getListGroupsDto
   * @param params ParamGroupZoneIdDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @AuthRules(UserRule.UserManagement)
  @Get('admin/list/:zoneId')
  async getListAdmin(
    @Request() req: IRequest,
    @Query() getListGroupsDto: GetListGroupsDto,
    @Param() params: ParamGroupZoneIdDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    let zoneId = params.zoneId;
    const results = await this.groupsService.getList(
      zoneId,
      user,
      getListGroupsDto,
    );
    return this.res.success(results);
  }

  /**
   * This API get list group of zone (web admin)
   *
   * @request req IRequest
   * @query getListGroupByZoneArrayDto GetListGroupByZoneArrayDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @AuthRules(UserRule.UserManagement)
  @Get('admin/list-group/')
  async getListGroupByZoneArray(
    @Request() req: IRequest,
    @Query() getListGroupByZoneArrayDto: GetListGroupByZoneArrayDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const results = await this.groupsService.getListGroupByZoneArray(
      user,
      getListGroupByZoneArrayDto,
    );
    return this.res.success(results);
  }

  /**
   * This API update group
   *
   * @request req IRequest
   * @param updateGroupsDto UpdateGroupsDto
   * @body params ParamGroupDetailDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put(':id')
  async updateGroup(
    @Request() req: IRequest,
    @Param() params: ParamGroupDetailDto,
    @Body() updateGroupsDto: UpdateGroupsDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const id = params.id;
    const results = await this.groupsService.updateGroup(
      user,
      id,
      updateGroupsDto,
    );
    return this.res.success(results);
  }

  /**
   * This API delete group
   *
   * @request req IRequest
   * @param params ParamGroupDetailDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Delete(':id')
  public async deleteZone(
    @Request() req: IRequest,
    @Param() params: ParamGroupDetailDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const id = params.id;
    const results = await this.groupsService.deleteGroup(user, id);
    return this.res.success(results);
  }

  /**
   * This API change position of group
   *
   * @body updateButtonPositionDto UpdateButtonPositionDto
   * @request req IRequest
   * @param params ParamGroupDetailDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put('position/:id')
  public async updateButtonPosition(
    @Body() updateButtonPositionDto: UpdateButtonPositionDto,
    @Request() req: IRequest,
    @Param() params: ParamGroupDetailDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const id = params.id;
    const results = await this.groupsService.updateButtonPosition(
      id,
      updateButtonPositionDto,
      user,
    );
    return this.res.success(results);
  }

  /**
   * This function update setting of device
   
   * @Request req IRequest
   * @Param params: AttachIdDto
   * @Body updateGroupSettingDto UpdateGroupSettingDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put('setting/:id')
  async updateGroupSetting(
    @Request() req: IRequest,
    @Param() params: AttachIdDto,
    @Body() updateGroupSettingDto: UpdateGroupSettingDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const groupId = params.id;
    const user = req.user;
    let data = await this.groupsService.updateGroupSetting(
      groupId,
      updateGroupSettingDto,
      user,
    );

    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API is update sensor setting in group

   * @Request req IRequest
   * @param params AttachIdDto
   * @Body updateGroupSensorSettingDto UpdateGroupSensorSettingDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put('/sensor/detection/:id')
  async updateGroupSensorSetting(
    @Request() req: IRequest,
    @Param() params: AttachIdDto,
    @Body() updateGroupSensorSettingDto: UpdateGroupSensorSettingDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const groupId = params.id;
    const user = req.user;
    let data = await this.groupsService.updateGroupSettingSensor(
      groupId,
      updateGroupSensorSettingDto,
      user,
    );

    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API is update light optimization sensor on group and set master sensor
   * @request req IRequest
   * @param params AttachIdDto
   * @body updateGroupLightOptimizationModeDto UpdateGroupLightOptimizationModeDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put('/sensor/optimization/:id')
  async updateGroupSensorOptimization(
    @Request() req: IRequest,
    @Param() params: AttachIdDto,
    @Body()
    updateGroupLightOptimizationModeDto: UpdateGroupLightOptimizationModeDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const groupId = params.id;
    const user = req.user;
    let data = await this.groupsService.updateLightOptimizationMode(
      user,
      groupId,
      updateGroupLightOptimizationModeDto,
    );

    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API is update indicator mode sensor for group

   * @param req IRequest
   * @param params AttachIdDto
   * @param updateIndicatorModeDto UpdateIndicatorModeDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put('/sensor/indicator/:id')
  async updateGroupSensorIndicatorMode(
    @Request() req: IRequest,
    @Param() params: AttachIdDto,
    @Body()
    updateIndicatorModeDto: UpdateIndicatorModeDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const groupId = params.id;
    const user = req.user;
    let data = await this.groupsService.updateGroupIndicatorMode(
      user,
      groupId,
      updateIndicatorModeDto,
    );

    return this.res.success(data, 'SUCCESS');
  }
}
