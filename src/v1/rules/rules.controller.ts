import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { AttachIdDto } from '../../utils/dto/params.dto';
import { AuthRoles } from '../roles/decorator/authRoles.decorator';
import { UserRole } from '../users/user.const';
import {
  IErrorResponse,
  ISuccessResponse,
} from '../../utils/interfaces/response.interface';
import { CreateRuleDto } from './dto/create-rule.dto';
import { GetRuleDto } from './dto/get-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { RulesService } from './rules.service';
import { ResponseService } from '../../utils/response.service';

@ApiTags('Rules')
@Controller()
export class RulesController {
  constructor(
    private readonly rulesService: RulesService,
    private res: ResponseService,
  ) {}

  /**
   *  This API create data of rule
   *
   * @Body createRuleDto CreateRuleDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin)
  @Post()
  @ApiOperation({ description: 'This API create data of rule' })
  @ApiBody({ type: CreateRuleDto })
  async createRule(
    @Body() createRuleDto: CreateRuleDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const data = await this.rulesService.create(createRuleDto);
    return this.res.success(data);
  }

  /**
   *  This API get list data of rule
   *
   * @Query getRuleDto GetRuleDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @Get()
  @ApiOperation({ description: 'This API get list data of rule' })
  async getList(
    @Query() getRuleDto: GetRuleDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const results = await this.rulesService.getList(getRuleDto);
    return this.res.success(results);
  }

  /**
   *  This API get detail data of rule
   *
   * @Param params AttachIdDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @Get(':id')
  @ApiOperation({ description: 'This API get detail data of rule' })
  @ApiParam({ name: 'id', description: 'id of rule', required: true })
  async getDetail(
    @Param() params: AttachIdDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const id = params.id;
    const data = await this.rulesService.getDetail(id);
    return this.res.success(data);
  }

  /**
   *  This API update data of rule
   *
   * @Param Param AttachIdDto
   * @Body updateRuleDto UpdateRuleDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.SuperAdmin)
  @ApiOperation({ description: 'This API update data of rule' })
  @ApiParam({ name: 'id', description: 'id of rule', required: true })
  @Patch(':id')
  async update(
    @Param() params: AttachIdDto,
    @Body() updateRuleDto: UpdateRuleDto,
  ) {
    const id: number = params.id;
    const data = await this.rulesService.updateRule(id, updateRuleDto);
    return this.res.success(data);
  }
}
