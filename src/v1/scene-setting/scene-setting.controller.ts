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
import { IRequest } from 'src/interfaces/request.interface';
import {
  IErrorResponse,
  ISuccessResponse,
} from '../../interfaces/response.interface';
import { ResponseService } from '../../utils/response.service';
import { AuthRoles } from '../roles/decorator/roles.decorator';
import { AuthRules } from '../rules/decorator/rules.decorator';
import { UserRule } from '../rules/rule.const';
import { UserRole } from '../users/user.const';
import { CreateSceneSettingDto } from './dto/create-scene-setting.dto';
import { GetSceneSettingDto } from './dto/get-scene-setting.dto';
import {
  ParamSceneIdDto,
  ParamSceneSettingDetailDto,
} from './dto/params-scene-setting.dto';
import { SceneSettingService } from './scene-setting.service';

@Controller()
export class SceneSettingController {
  constructor(
    private readonly sceneSettingService: SceneSettingService,
    private res: ResponseService,
  ) {}

  /**
   * This API is create new scene setting
   * @request req IRequest
   * @body createSceneSettingDto createSceneSettingDto
   * @param params ParamSceneIdDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Post(':sceneId')
  public async createSceneSetting(
    @Request() req: IRequest,
    @Body() createSceneSettingDto: CreateSceneSettingDto,
    @Param() params: ParamSceneIdDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const sceneId = params.sceneId;

    const result = await this.sceneSettingService.createSceneSetting(
      sceneId,
      user.userId,
      createSceneSettingDto,
    );
    return this.res.success(result);
  }

  /**
   * This function is update scene setting
   *
   * @request req IRequest
   * @body updateSceneSettingDto createSceneSettingDto
   * @param params ParamSceneSettingDetailDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put(':id')
  public async updateSceneSetting(
    @Request() req: IRequest,
    @Body() updateSceneSettingDto: CreateSceneSettingDto,
    @Param() params: ParamSceneSettingDetailDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const id = params.id;

    const result = await this.sceneSettingService.updateSceneSetting(
      id,
      updateSceneSettingDto,
      user.userId,
    );
    return this.res.success(result);
  }

  /**
   * This API get list scene setting for web
   *
   * @query getSceneSettingDto GetSceneSettingDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin, UserRole.SuperAdmin)
  @AuthRules(UserRule.SceneInquiry)
  @Get('web/list')
  public async listSceneForWeb(
    @Query() getSceneSettingDto: GetSceneSettingDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const result = await this.sceneSettingService.listSceneSettingByWeb(
      getSceneSettingDto,
    );

    return this.res.success(result);
  }
}
