import { AttachFloorIdDto } from './../../dto/params.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { AttachZoneIdDto } from '../../dto/params.dto';
import { IRequest } from '../../interfaces/request.interface';
import {
  IErrorResponse,
  ISuccessResponse,
} from '../../interfaces/response.interface';
import { ResponseService } from '../../utils/response.service';
import { AuthRoles } from '../roles/decorator/roles.decorator';
import { AuthRules } from '../rules/decorator/rules.decorator';
import { UserRule } from '../rules/rule.const';
import { UserRole } from '../users/user.const';
import { DevicesService } from './devices.service';
import { DeleteListDeviceDto } from './dto/ delete-device.dto';
import {
  ChangeAreaDeviceAssignDto,
  ChangeAreaSensorAssignDto,
} from './dto/change-group.dto';
import {
  CreateDeviceDto,
  CreateDeviceSensorDto,
} from './dto/create-device.dto';
import {
  GetListDeviceByGatewayDto,
  GetListDeviceDto,
  GetListDeviceForAdminDto,
  GetListGateWayDeviceDto,
  GetListSensorSingleDto,
} from './dto/get-list-device.dto';
import { ParamDetailDeviceDto, ParamGatewayDto } from './dto/params-device.dto';
import { QueryAddressDto } from './dto/query-device.dto';
import { ChangeNameDeviceDto } from './dto/update-device.dto';
import { AssignAreaForGatewayDto } from './dto/assign-area-for-gateway.dto';

@Controller()
export class DevicesController {
  constructor(
    private readonly devicesService: DevicesService,
    private res: ResponseService,
  ) {}

  /**
   * This API create device
   *
   * @request req IRequest
   * @body createDeviceDto CreateDeviceDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Post()
  async create(
    @Request() req: IRequest,
    @Body() createDeviceDto: CreateDeviceDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const data = await this.devicesService.createDevice(user, createDeviceDto);
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API to get list device for mobile
   *
   * @query req IRequest
   * @request getListDeviceDto GetListDeviceDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.User)
  @Get()
  async getListDevice(
    @Query() getListDeviceDto: GetListDeviceDto,
    @Request() req: IRequest,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const data = await this.devicesService.getListDevice(
      user,
      getListDeviceDto,
    );

    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API to get list gateway device for mobile
   *
   * @query req IRequest
   * @request getListDeviceDto GetListDeviceDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.User)
  @Get('gateway')
  async getListGateWayDevice(
    @Query() getListGateWayDeviceDto: GetListGateWayDeviceDto,
    @Request() req: IRequest,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const data = await this.devicesService.getListGateWayDevice(
      user,
      getListGateWayDeviceDto,
    );

    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API to get list device for admin
   *
   * @query req IRequest
   * @request getListDeviceForAdminDto GetListDeviceForAdminDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.SuperAdmin)
  @Get('admin/list-device')
  async getListDeviceForAdmin(
    @Query() getListDeviceForAdminDto: GetListDeviceForAdminDto,
    @Request() req: IRequest,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const data = await this.devicesService.getListDeviceForAdmin(
      user,
      getListDeviceForAdminDto,
    );

    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API to get detail device by address
   *
   * @query query ParamDetailDeviceDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.User)
  @Get('/get-detail-by-address')
  async getDetailDeviceByAddress(
    @Query() query: QueryAddressDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const address = query.address;
    const data = await this.devicesService.getDetailDeviceByAddress(address);
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API to get detail device
   *
   * @param params ParamDetailDeviceDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.User, UserRole.SuperAdmin)
  @Get(':id')
  async getDetailDevice(
    @Param() params: ParamDetailDeviceDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const id = params.id;
    const data = await this.devicesService.getDetailDevice(id);
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API to delete list device
   *
   * @body deleteListDeviceDto DeleteListDeviceDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put()
  async deleteListDevice(
    @Body() deleteListDeviceDto: DeleteListDeviceDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const data = await this.devicesService.deleteListDevice(
      deleteListDeviceDto,
    );

    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API change device assign
   *
   * @request req IRequest
   * @body changeGroupDeviceAssignDto ChangeGroupDeviceAssignDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put('change-assign')
  public async changeDeviceAssign(
    @Request() req: IRequest,
    @Body() changeGroupDeviceAssignDto: ChangeAreaDeviceAssignDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const data = await this.devicesService.changeAreaAssign(
      user,
      changeGroupDeviceAssignDto,
    );
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API check device smart switch in zone
   *
   * @param params AttachZoneIdDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.User)
  @Get('check-smart-switch-in-zone/:zoneId')
  public async checkDeviceSmartSwitch(
    @Param() params: AttachZoneIdDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const zoneId = params.zoneId;

    const result: any = await this.devicesService.checkDeviceSmartSwitch(
      zoneId,
    );

    let data = {
      isRegistered: result.isRegistered,
      protocolDeviceId: result.protocolDeviceId,
      smartSwitchId: result.smartSwitchId,
    };

    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API create device smart sensor

   * @param req IRequest
   * @param createDeviceSensorDto CreateDeviceSensorDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Post('/sensor')
  public async createSmartSensor(
    @Request() req: IRequest,
    @Body() createDeviceSensorDto: CreateDeviceSensorDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const data = await this.devicesService.createSensor(
      user,
      createDeviceSensorDto,
    );
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API change device sensor assign
   *
   * @request req IRequest
   * @body changeAreaSensorAssignDto ChangeAreaSensorAssignDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put('change-assign-sensor')
  public async changeSensorAssign(
    @Request() req: IRequest,
    @Body() changeAreaSensorAssignDto: ChangeAreaSensorAssignDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const data = await this.devicesService.changeAreaAssignSensor(
      user,
      changeAreaSensorAssignDto,
    );
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API is change name of device

   * @request req IRequest
   * @body changeNameDeviceDto ChangeNameDeviceDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put('change-name-device')
  public async changeNameDevice(
    @Request() req: IRequest,
    @Body() changeNameDeviceDto: ChangeNameDeviceDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;

    const data = await this.devicesService.changeNameDevice(
      user,
      changeNameDeviceDto,
    );
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API is get list sensor in option single

   * @request req IRequest
   * @query query GetListSensorSingleDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.User)
  @Get('get-list/sensor-single')
  async getListDeviceSensorSingle(
    @Request() req: IRequest,
    @Query() query: GetListSensorSingleDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const data = await this.devicesService.getListSensorSingle(user, query);
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API get list device by gateway
   * @query getListDeviceByGatewayDto GetListDeviceByGatewayDto
   * @param params ParamGatewayDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.SuperAdmin)
  @AuthRules(UserRule.DeviceManagement)
  @Get('web/list-by-gateway/:gatewayId')
  public async getListByGateway(
    @Param() params: ParamGatewayDto,
    @Query() getListDeviceByGatewayDto: GetListDeviceByGatewayDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const gateway = params.gatewayId;
    const data = await this.devicesService.getListDeviceByGateway(
      gateway,
      getListDeviceByGatewayDto,
    );

    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API is assign area for gateway

   * @request req IRequest
   * @body assignAreaForGatewayDto AssignAreaForGatewayDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.User)
  @Post('/assign-area-for-gateway')
  async assignAreaForGateway(
    @Request() req: IRequest,
    @Body() assignAreaForGatewayDto: AssignAreaForGatewayDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const data = await this.devicesService.assignAreaForGateway(
      user,
      assignAreaForGatewayDto,
    );
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API check device gateway in floor
   *
   * @param params AttachZoneIdDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.User)
  @Get('check-gateway-in-floor/:floorId')
  public async checkDeviceGateway(
    @Param() params: AttachFloorIdDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const floorId = params.floorId;

    const result: any = await this.devicesService.checkDeviceSmartGateway(
      floorId,
      );

    return this.res.success(result, 'SUCCESS');
  }
}
