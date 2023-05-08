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
import { UpdateSceneSettingDto } from '../scene-setting/dto/update-scene-setting.dto';
import { UserRole } from '../users/user.const';
import { CreateSceneDto } from './dto/create-scene.dto';
import { GetListSceneByBuildingDto, GetScenesDto } from './dto/get-scenes.dto';
import {
  ParamSceneDetailDto,
  ParamSceneDeviceDto,
  ParamSceneFloorIdDto
} from './dto/params-scenes.dto';
import { UpdateSceneDto } from './dto/update-scene.dto';
import { SceneService } from './scene.service';

@Controller()
export class SceneController {
  constructor(
    private readonly sceneService: SceneService,
    private res: ResponseService,
  ) {}

  /**
   * This API is create new scene
   *
   * @request req IRequest
   * @body createSceneDto CreateSceneDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Post('')
  public async createScene(
    @Request() req: IRequest,
    @Body() createSceneDto: CreateSceneDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;

    const result = await this.sceneService.createScene(
      user.userId,
      createSceneDto,
    );
    return this.res.success(result, 'SUCCESS');
  }

  /**
   * This API get detail scene
   *
   * @param params  ParamSceneDetailDto
   * @request req IRequest
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Get(':id')
  public async detailScene(
    @Param() params: ParamSceneDetailDto,
    @Request() req: IRequest,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const id = params.id;

    const result = await this.sceneService.detailScene(user, id);

    return this.res.success(result, 'SUCCESS');
  }

  /**
   * This API get list scene by floor id
   *
   * @param params ParamSceneFloorIdDto
   * @request req IRequest
   * @query getScenesDTO GetScenesDTO
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.User)
  @Get('list/:floorId')
  public async getListScene(
    @Param() params: ParamSceneFloorIdDto,
    @Request() req: IRequest,
    @Query() getScenesDTO: GetScenesDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const floorId = params.floorId;

    const user = req.user;
    const result = await this.sceneService.getListScene(
      floorId,
      user,
      getScenesDTO,
    );

    return this.res.success(result, 'SUCCESS');
  }

  /**
   * This API update scene
   *
   * @param params ParamSceneDetailDto
   * @body updateSceneDto UpdateSceneDto
   * @request req IRequest
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put(':id')
  public async updateName(
    @Param() params: ParamSceneDetailDto,
    @Body() updateSceneDto: UpdateSceneDto,
    @Request() req: IRequest,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;

    const id = params.id;

    const result = await this.sceneService.renameScene(
      id,
      updateSceneDto,
      user.userId,
    );

    return this.res.success(result, 'SUCCESS');
  }

  /**
   * This API is delete scene
   *
   * @param params ParamSceneDetailDto
   * @request req IRequest
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Delete(':id')
  public async deleteScene(
    @Param() params: ParamSceneDetailDto,
    @Request() req: IRequest,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;

    const id = params.id;

    const result = await this.sceneService.deleteScene(id, user.userId);

    return this.res.success(result);
  }

  /**
   * This API update scene setting in scene
   *
   * @param params ParamSceneDetailDto
   * @request req IRequest
   * @body updateSceneSettingDto updateSceneSettingDto[]
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put('setting/:id')
  public async updateListSetting(
    @Param() params: ParamSceneDetailDto,
    @Request() req: IRequest,
    @Body() updateSceneSettingDto: UpdateSceneSettingDto[],
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;

    const id = params.id;

    const result = await this.sceneService.updateSceneSetting(
      id,
      updateSceneSettingDto,
      user.userId,
    );

    return this.res.success(result);
  }

  /**
   * This API get list scene by building
   *
   * @query getListSceneByBuildingDto GetListSceneByBuildingDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.SuperAdmin)
  @AuthRules(UserRule.SceneInquiry)
  @Get('admin/list-by-building')
  public async getListSceneByBuilding(
    @Query() getListSceneByBuildingDto: GetListSceneByBuildingDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const results = await this.sceneService.getListSceneByBuilding(
      getListSceneByBuildingDto,
    );
    return this.res.success(results);
  }

  /**
   * This API get detail scene for web
   *
   * @param params ParamSceneDetailDto
   * @request req IRequest
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.SuperAdmin)
  @AuthRules(UserRule.SceneInquiry)
  @Get('web/:id')
  public async detailSceneWeb(
    @Param() params: ParamSceneDetailDto,
    @Request() req: IRequest,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const id = params.id;

    const result = await this.sceneService.detailScene(user, id);

    return this.res.success(result, 'SUCCESS');
  }

  /**
   * This API get list scene by device
   * @param params ParamSceneDeviceDto
   * @query getScenesDTO GetScenesDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.SuperAdmin)
  @AuthRules(UserRule.DeviceManagement)
  @Get('Web/list-by-device/:deviceId')
  public async getListSceneByDevice(
    @Param() params: ParamSceneDeviceDto,
    @Query() getScenesDTO: GetScenesDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const device = params.deviceId;
    const result = await this.sceneService.getSceneByDevice(
      device,
      getScenesDTO,
    );

    return this.res.success(result, 'SUCCESS');
  }
}
