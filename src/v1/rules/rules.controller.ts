import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  IErrorResponse,
  ISuccessResponse,
} from '../../interfaces/response.interface';
import { ResponseService } from '../../utils/response.service';
import { AuthRoles } from '../roles/decorator/roles.decorator';
import { UpdateUsersRulesDto } from '../users-rules/dto/update-users-rules.dto';
import { UserRole } from '../users/user.const';
import { CreateRuleDto } from './dto/create-rule.dto';
import { GetRuleDto } from './dto/get-rule.dto';
import { ParamRuleDetailDto, ParamRuleUserIdDto } from './dto/params-rules.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { RulesService } from './rules.service';

@Controller()
export class RulesController {
  constructor(
    private readonly rulesService: RulesService,
    private res: ResponseService,
  ) {}

  /**
   * This API is create new rule
   *
   * @body createRuleDto CreateRuleDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin)
  @Post()
  async createRule(
    @Body() createRuleDto: CreateRuleDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let data = await this.rulesService.create(createRuleDto);
    return this.res.success(data);
  }

  /**
   * This API get list rule
   *
   * @query getRuleDto GetRuleDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @Get()
  async getList(
    @Query() getRuleDto: GetRuleDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const results = await this.rulesService.getList(getRuleDto);
    return this.res.success(results);
  }

  /**
   * This API get detail rule
   *
   * @param params ParamRuleDetailDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @Get('/:id')
  async getDetail(
    @Param() params: ParamRuleDetailDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let id = params.id;
    let data = await this.rulesService.getDetail(id);
    return this.res.success(data);
  }

  /**
   * This function is update rule
   *
   * @param params ParamRuleDetailDto
   * @body updateRuleDto UpdateRuleDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin)
  @Put('admin/:id')
  async update(
    @Param() params: ParamRuleDetailDto,
    @Body() updateRuleDto: UpdateRuleDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let id = params.id;
    let data = await this.rulesService.updateRule(id, updateRuleDto);
    return this.res.success(data);
  }

  /**
   * This API get list rule by account
   *
   * @param params ParamRuleUserIdDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @Get('admin/:userId')
  public async getListRuleByUserAccount(
    @Param() params: ParamRuleUserIdDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let userId = params.userId;
    let data = await this.rulesService.getListRuleByUserAccount(userId);
    return this.res.success(data);
  }

  /**
   * This API is update rules for a admin account
   *
   * @body updateUsersRulesDto UpdateUsersRulesDto
   * @param param ParamRuleUserIdDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin)
  @Put(':userId')
  public async changeRulesOfUser(
    @Body() updateUsersRulesDto: UpdateUsersRulesDto,
    @Param() param: ParamRuleUserIdDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const userId = param.userId;
    let data = await this.rulesService.changeRulesOfUser(
      userId,
      updateUsersRulesDto,
    );
    return this.res.success(data);
  }
}
