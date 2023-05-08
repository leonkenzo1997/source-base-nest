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
import { IRequest } from '../../interfaces/request.interface';
import {
  IErrorResponse,
  ISuccessResponse
} from '../../interfaces/response.interface';
import { ResponseService } from '../../utils/response.service';
import { AuthRoles } from '../roles/decorator/roles.decorator';
import { AuthRules } from '../rules/decorator/rules.decorator';
import { UserRule } from '../rules/rule.const';
import { ParamSceneDeviceDto } from '../scene/dto/params-scenes.dto';
import { UserRole } from '../users/user.const';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import {
  GetListScheduleForMobileDto,
  GetListScheduleForWebDto
} from './dto/get-list-schedule.dto';
import { ParamScheduleDetailDto } from './dto/params-schedule.dto';
import { UpdateNameScheduleDto } from './dto/update-name-schedule.dto';
import { UpdateSettingScheduleDto } from './dto/update-setting-schedule.dto';
import { ScheduleService } from './schedule.service';

@Controller()
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private res: ResponseService,
  ) {}

  /**
   * This function create schedule
   *
   * @Body req IRequest
   * @Request createScheduleDto CreateScheduleDto
   * @returns ISchedule
   */
  @AuthRoles(UserRole.Admin)
  @Post()
  async create(
    @Body() createScheduleDto: CreateScheduleDto,
    @Request() req: IRequest,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const data = await this.scheduleService.createSchedule(
      user,
      createScheduleDto,
    );
    return this.res.success(data);
  }

  /**
   * This API get list schedule
   *
   * @Query getListScheduleForMobileDto: GetListScheduleForMobileDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.User)
  @Get()
  async GetListSchedules(
    @Query() getListScheduleForMobileDto: GetListScheduleForMobileDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const data = await this.scheduleService.getListSchedule(
      getListScheduleForMobileDto,
    );
    return this.res.success(data);
  }

  /**
   * This API get list schedule for admin web
   *
   * @Query getListScheduleForWebDto: GetListScheduleForWebDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.SuperAdmin)
  @AuthRules(UserRule.ScheduleInquiry)
  @Get('/web')
  async GetListSchedulesForWeb(
    @Query() getListScheduleForWebDto: GetListScheduleForWebDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const data = await this.scheduleService.getListSchedule(
      getListScheduleForWebDto,
    );
    return this.res.success(data);
  }

  /**
   * This API get detail data of schedule
   *
   * @param params ParamScheduleDetailDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.User)
  @Get(':id')
  async GetDetailSchedule(
    @Param() params: ParamScheduleDetailDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const scheduleId = params.id;
    const data = await this.scheduleService.getDetailSchedule(scheduleId);
    return this.res.success(data);
  }

  /**
   * This function get detail data of schedule for web
   *
   * @param params ParamScheduleDetailDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.SuperAdmin)
  @AuthRules(UserRule.ScheduleInquiry)
  @Get('web/:id')
  async GetDetailScheduleForWeb(
    @Param() params: ParamScheduleDetailDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const scheduleId = params.id;
    const data = await this.scheduleService.getDetailSchedule(scheduleId);
    return this.res.success(data);
  }

  /**
   * This function update name of schedule
   *
   * @param req IRequest
   * @param params ParamScheduleDetailDto
   * @param updateNameScheduleDto: UpdateNameScheduleDto,
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put(':id')
  async updateNameSchedule(
    @Request() req: IRequest,
    @Param() params: ParamScheduleDetailDto,
    @Body() updateNameScheduleDto: UpdateNameScheduleDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const scheduleId = params.id;
    let userId = req.user.userId;
    const data = await this.scheduleService.updateNameOfSchedule(
      userId,
      scheduleId,
      updateNameScheduleDto,
    );
    return this.res.success(data);
  }

  /**
   * This API get detail data of schedule
   *
   * @Request req IRequest
   * @Param params ParamScheduleDetailDto
   * @Body updateSettingScheduleDto: UpdateSettingScheduleDto,
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put('/list/:id')
  async updateSettingSchedule(
    @Request() req: IRequest,
    @Param() params: ParamScheduleDetailDto,
    @Body() updateSettingScheduleDto: UpdateSettingScheduleDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const scheduleId = params.id;
    let userId = req.user.userId;
    const data = await this.scheduleService.updateSettingSchedule(
      userId,
      scheduleId,
      updateSettingScheduleDto,
    );
    return this.res.success(data);
  }

  /**
   * This API delete data of schedule
   *
   * @Param params ParamScheduleDetailDto
   * @Request req IRequest
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Delete(':id')
  async deleteSchedule(
    @Param() params: ParamScheduleDetailDto,
    @Request() req: IRequest,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const scheduleId = params.id;
    const user = req.user;
    const data = await this.scheduleService.deleteSchedule(user, scheduleId);
    return this.res.success(data);
  }

  @AuthRoles(UserRole.Admin, UserRole.SuperAdmin)
  @AuthRules(UserRule.DeviceManagement)
  @Get('web/list-by-device/:deviceId')
  public async listScheduleByDevice(
    @Param() params: ParamSceneDeviceDto,
    @Query() getListScheduleForMobileDto: GetListScheduleForMobileDto,
  ) {
    const device = params.deviceId;
    const data = await this.scheduleService.getListScheduleByDevice(
      device,
      getListScheduleForMobileDto,
    );
    return this.res.success(data);
  }
}
