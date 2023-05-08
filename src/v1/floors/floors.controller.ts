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
import { AttachIdDto } from '../../dto/params.dto';
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
import { CreateFloorDto } from './dto/create-floors.dto';
import { EditNameFloorDTO } from './dto/edit-name-floor';
import {
  GetListFloorByBuildingDTO,
  GetListFloorByUserDTO,
} from './dto/get-list-floors-by-building.dto';
import { GetListFloorDTO } from './dto/get-list-floors.dto';
import { ParamFloorDetailDto } from './dto/params-floors.dto';
import { UpdateListFloorDTO } from './dto/update-list-floors.dto';
import { FloorsService } from './floors.service';

@Controller()
export class FloorsController {
  constructor(
    private readonly floorsServices: FloorsService,
    private res: ResponseService,
  ) {}

  /**
   * This API get list floor by id account user
   *
   * @request req IRequest
   * @query getListFloorDto GetListFloorByUserDTO
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.SuperAdmin)
  @AuthRules(UserRule.UserManagement)
  @Get('get-floors-by-user')
  public async getListFloorsByUser(
    @Request() req: IRequest,
    @Query() getListFloorDto: GetListFloorByUserDTO,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const data = await this.floorsServices.getListFloorByUser(
      getListFloorDto,
      user,
    );
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API for get list floor by building
   *
   * @query getListFloorDto GetListFloorByBuildingDTO
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.SuperAdmin)
  @AuthRules(UserRule.UserManagement, UserRule.Provisioning)
  @Get('get-list-floor-by-building')
  public async getListFloorsByBuilding(
    @Query() getListFloorDto: GetListFloorByBuildingDTO,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const data = await this.floorsServices.getListFloorsByBuilding(
      getListFloorDto,
    );
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API for get floor with list zone and group
   * @param params ParamFloorDetailDto
   * @request req IRequest
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.User)
  @Get('get-floor-with-list-zone-group/:id')
  public async getListFloorZoneGroup(
    @Param() params: ParamFloorDetailDto,
    @Request() req: IRequest,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const floorId = params.id;
    const user = req.user;
    const data = await this.floorsServices.getListFloorZoneGroup(user, floorId);
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API get list floor by user login
   *
   * @request req IRequest
   * @query getListFloorDto GetListFloorDTO
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.User)
  @Get()
  public async getListFloors(
    @Request() req: IRequest,
    @Query() getListFloorDto: GetListFloorDTO,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const data = await this.floorsServices.getListFloors(getListFloorDto, user);
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API change user assign to floor
   *
   * @param params AttachIdDto
   * @body updateListFloorDto UpdateListFloorDTO
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin)
  @AuthRules(UserRule.UserManagement)
  @Put('change-floor-of-user/:id')
  public async changeListFloorForUser(
    @Param() params: AttachIdDto,
    @Body() updateListFloorDto: UpdateListFloorDTO,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const userId = params.id;
    const data = await this.floorsServices.changeListFloorForUser(
      updateListFloorDto,
      userId,
    );
    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This API edit name floor
   *
   * @request req IRequest
   * @param params AttachIdDto
   * @body data EditNameFloorDTO
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put(':id')
  public async editNameFloor(
    @Request() req: IRequest,
    @Param() params: AttachIdDto,
    @Body() data: EditNameFloorDTO,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let userId = req.user.userId;
    const id = params.id;
    const results = await this.floorsServices.editNameFloor(userId, id, data);

    return this.res.success(results, 'SUCCESS');
  }

  /**
   * This API get detail floor
   *
   * @param params AttachIdDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.SuperAdmin)
  @Get(':id')
  public async getDetailFloors(
    @Param() params: AttachIdDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const id = params.id;
    const results = await this.floorsServices.getDetailFloors(id);

    return this.res.success(results, 'SUCCESS');
  }

  /**
   * This API delete floor
   *
   * @request req IRequest
   * @param params AttachIdDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.SuperAdmin)
  @Delete(':id')
  public async deleteFloor(
    @Request() req: IRequest,
    @Param() params: AttachIdDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let user = req.user;
    let id = params.id;
    await this.floorsServices.deleteFloor(user, id);

    return this.res.success();
  }

  /**
   * This API create new floor
   *
   * @body createFloorDto CreateFloorDto
   * @request req IRequest
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Post()
  public async createFloor(
    @Body() createFloorDto: CreateFloorDto,
    @Request() req: IRequest,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let user = req.user;
    const response = await this.floorsServices.createFloor(
      user,
      createFloorDto,
    );
    return this.res.success(response);
  }

  /**
   * This API for get floor with list zone and group for web
   * @param params ParamFloorDetailDto
   * @request req IRequest
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.SuperAdmin)
  @Get('web/get-floor-with-list-zone-group/:id')
  public async getListFloorZoneGroupForWeb(
    @Param() params: ParamFloorDetailDto,
    @Request() req: IRequest,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const floorId = params.id;
    const user = req.user;
    const data = await this.floorsServices.getListFloorZoneGroupForWeb(floorId);
    return this.res.success(data, 'SUCCESS');
  }
}
