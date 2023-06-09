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
import { AttachIdDto } from 'src/dto/params.dto';
import { ResponseService } from 'src/utils/response.service';
import { AuthRoles } from '../roles/decorator/authRoles.decorator';
import { UserRole } from '../users/user.const';
import {
  IErrorResponse,
  ISuccessResponse,
} from './../../interfaces/response.interface';
import { CreateRuleDto } from './dto/create-rule.dto';
import { GetRuleDto } from './dto/get-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { RulesService } from './rules.service';

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
    let data = await this.rulesService.create(createRuleDto);
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
    let id = params.id;
    let data = await this.rulesService.getDetail(id);
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
    let id: number = params.id;
    let data = await this.rulesService.updateRule(id, updateRuleDto);
    return this.res.success(data);
  }
}
