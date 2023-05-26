import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ResponseService } from 'src/utils/response.service';
import { AuthRoles } from '../roles/decorator/roles.decorator';
import { UserRole } from '../users/user.const';
import {
  IErrorResponse,
  ISuccessResponse,
} from './../../interfaces/response.interface';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { RulesService } from './rules.service';
import { GetRuleDto } from './dto/get-rule.dto';

@Controller()
export class RulesController {
  constructor(
    private readonly rulesService: RulesService,
    private res: ResponseService,
  ) {}

  @AuthRoles(UserRole.SuperAdmin)
  @Post()
  async createRule(
    @Body() createRuleDto: CreateRuleDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let data = await this.rulesService.create(createRuleDto);
    return this.res.success(data);
  }

  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @Get()
  async getList(
    @Query() getRuleDto: GetRuleDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const results = await this.rulesService.getList(getRuleDto);
    return this.res.success(results);
  }

  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @Get(':id')
  async getDetail(
    @Param('id') id: number,
  ): Promise<ISuccessResponse | IErrorResponse> {
    let data = await this.rulesService.getDetail(id);
    return this.res.success(data);
  }

  @AuthRoles(UserRole.SuperAdmin)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateRuleDto: UpdateRuleDto) {
    let data = await this.rulesService.updateRule(id, updateRuleDto);
    return this.res.success(data);
  }
}
