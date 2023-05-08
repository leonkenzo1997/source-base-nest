/* eslint-disable prettier/prettier */
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
import {
  IErrorResponse,
  ISuccessResponse,
} from '../../interfaces/response.interface';
import { ResponseService } from '../../utils/response.service';
import { AuthRoles } from '../roles/decorator/roles.decorator';
import { UserRole } from '../users/user.const';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dto/create-buildings.dto';
import { GetBuildingDto } from './dto/get-buildings.dto';
import { ParamDetailBuildingDto } from './dto/params-buildings.dto';
import {
  CheckNameBuildingDto,
  UpdateBuildingDto,
} from './dto/update-buildings.dto';

@Controller()
export class BuildingsController {
  constructor(
    private readonly buildingServices: BuildingsService,
    private res: ResponseService,
  ) {}

  /**
   * This API is get list of building
   *
   * @request req IRequest
   * @query getBuildingDto GetBuildingDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @Get()
  public async findAllBuilding(
    @Request() req: IRequest,
    @Query() getBuildingDto: GetBuildingDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const response = await this.buildingServices.findAllBuilding(
      user,
      getBuildingDto,
    );

    return this.res.success(response);
  }

  /**
   * This API is update building
   *
   * @body updateBuildingDto UpdateBuildingDto
   * @request req IRequest
   * @param param ParamDetailBuildingDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin)
  @Put(':id')
  public async updateBuilding(
    @Body() updateBuildingDto: UpdateBuildingDto,
    @Request() req: IRequest,
    @Param() param: ParamDetailBuildingDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const buildingId = param.id;
    const response = await this.buildingServices.updateBuilding(
      user.userId,
      updateBuildingDto,
      buildingId,
    );
    return this.res.success(response);
  }

  /**
   * This API is create one building
   *
   * @body createBuildingDto CreateBuildingDto
   * @request req IRequest
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin)
  @Post('')
  public async createBuilding(
    @Body() createBuildingDto: CreateBuildingDto,
    @Request() req: IRequest,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const response = await this.buildingServices.createBuilding(
      user.userId,
      createBuildingDto,
    );
    return this.res.success(response);
  }

  /**
   * This API is delete building
   *
   * @request req IRequest
   * @param param ParamDetailBuildingDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin)
  @Delete(':id')
  public async deleteBuilding(
    @Request() req: IRequest,
    @Param() param: ParamDetailBuildingDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const id = param.id;
    const response = await this.buildingServices.removeBuilding(
      user.userId,
      id,
    );

    return this.res.success(response);
  }

  /**
   * This API is Get detail building
   *
   * @param param ParamDetailBuildingDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @Get(':id')
  public async getBuilding(
    @Param() param: ParamDetailBuildingDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const id = param.id;
    const response = await this.buildingServices.detailBuilding(id);

    return this.res.success(response);
  }

  /**
   * This API check name Building
   *
   * @body body CheckName
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin)
  //@AuthRules(UserRule.UserManagement)
  @Post('/check-name')
  public async checkNameBuilding(
    @Body() body: CheckNameBuildingDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const name = body.name;
    const response = await this.buildingServices.checkNameBuilding(name);
    return this.res.success({}, 'SUCCESS');
  }
}
