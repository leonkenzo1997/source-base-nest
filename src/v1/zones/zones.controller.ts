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
import { UserRole } from '../users/user.const';
import { CreateZonesDto } from './dto/create-zones.dto';
import { GetZonesDto, GetZonesGatewayDto } from './dto/get-zones.dto';
import {
  ParamZoneDetailDto,
  ParamZoneFloorIdDto,
  ParamZoneGatewayIdDto
} from './dto/param-zones.dto';
import { UpdateZonesDto } from './dto/update-zones.dto';
import { ZonesService } from './zones.service';

@Controller()
export class ZonesController {
  constructor(
    private readonly zonesService: ZonesService,
    private res: ResponseService,
  ) {}

  /**
   * This API to create zone
   *
   * @request req IRequest
   * @body createZonesDto CreateZonesDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Post('create')
  async createZone(
    @Request() req: IRequest,
    @Body() createZonesDto: CreateZonesDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const results = await this.zonesService.createZones(user, createZonesDto);
    return this.res.success(results);
  }

  /**
   * This API get detail zone
   *
   * request req IRequest
   * @param param ParamZoneDetailDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.User)
  @Get(':id')
  async getDetail(
    @Request() req: IRequest,
    @Param() param: ParamZoneDetailDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const zoneId = param.id;
    const results = await this.zonesService.getDetail(zoneId);
    return this.res.success(results);
  }

  /**
   * This API get list zone by floor id
   *
   * @request req IRequest
   * @query getZonesDto GetZonesDto
   * @param param ParamZoneFloorIdDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.User)
  @Get('list/:floorId')
  async getList(
    @Request() req: IRequest,
    @Query() getZonesDto: GetZonesDto,
    @Param() param: ParamZoneFloorIdDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const floorId = param.floorId;
    const results = await this.zonesService.getList(floorId, user, getZonesDto);
    return this.res.success(results);
  }

  /**
   * This API get list zone in web admin
   *
   * @request req IRequest
   * @query getZonesDto GetZonesDto
   * @param param ParamZoneFloorIdDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @AuthRules(UserRule.UserManagement)
  @Get('admin/list/:floorId')
  async getListAdmin(
    @Request() req: IRequest,
    @Query() getZonesDto: GetZonesDto,
    @Param() param: ParamZoneFloorIdDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const floorId = param.floorId;
    const results = await this.zonesService.getList(floorId, user, getZonesDto);
    return this.res.success(results);
  }

  /**
   * This API update zone by id
   *
   * @request req IRequest
   * @body updateZonesDto UpdateZonesDto
   * @param param ParamZoneDetailDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put(':id')
  async updateZone(
    @Request() req: IRequest,
    @Body() updateZonesDto: UpdateZonesDto,
    @Param() param: ParamZoneDetailDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const zoneId = param.id;
    const results = await this.zonesService.updateZone(
      zoneId,
      user,
      updateZonesDto,
    );
    return this.res.success(results);
  }

  /**
   * This API delete zone
   *
   * @request req IRequest
   * @param param ParamZoneDetailDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Delete(':id')
  public async deleteZone(
    @Request() req: IRequest,
    @Param() param: ParamZoneDetailDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const zoneId = param.id;
    await this.zonesService.deleteZone(user, zoneId);
    return this.res.success();
  }

  /**
   * this API is get list zone by gateway from web

   * @param param ParamZoneGatewayIdDto
   * @query getZonesDto GetZonesDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.SuperAdmin)
  @AuthRules(UserRule.DeviceManagement)
  @Get('web/list-by-gateway/:gatewayId')
  public async listZoneByGatewayWeb(
    @Param() param: ParamZoneGatewayIdDto,
    @Query() getZonesDto: GetZonesDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const gatewayId = param.gatewayId;

    const listZone = await this.zonesService.getListZoneByGatewayFromWeb(
      gatewayId,
      getZonesDto,
    );

    return this.res.success(listZone, 'SUCCESS');
  }

  /**
   * this API is get list zone by gateway from mobile

   * @param param ParamZoneGatewayIdDto
   * @query getZonesDto GetZonesDto
   * @request req IRequest
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Get('list-by-gateway/:gatewayId')
  public async listZoneByGateway(
    @Param() param: ParamZoneGatewayIdDto,
    @Query() getZonesDto: GetZonesGatewayDto,
    @Request() req: IRequest,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const gatewayId = param.gatewayId;
    const user = req.user;

    const listZone = await this.zonesService.getListZoneByGateway(
      gatewayId,
      getZonesDto,
      user,
    );

    return this.res.success(listZone, 'SUCCESS');
  }
}
