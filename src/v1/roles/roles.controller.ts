import {
  IErrorResponse,
  ISuccessResponse,
} from './../../interfaces/response.interface';
import { ResponseService } from './../../utils/response.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';
import { GetRoleDto } from './dto/get-role.dto';
import { UserRole } from '../users/user.const';
import { AuthRoles } from './decorator/authRoles.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller()
export class RolesController {
  constructor(
    private rolesService: RolesService,
    private res: ResponseService,
  ) {}

  @AuthRoles(UserRole.SuperAdmin)
  @Post('create')
  async createRole(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const results = await this.rolesService.createRoles(createRoleDto);
    return this.res.success(results);
  }

  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @Get(':id')
  async getDetail(
    @Param() id: number,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const results = await this.rolesService.getDetail(id);
    return this.res.success(results);
  }

  @AuthRoles(UserRole.SuperAdmin, UserRole.Admin)
  @Get()
  async getList(
    @Query() getRoleDto: GetRoleDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const results = await this.rolesService.getList(getRoleDto);
    return this.res.success(results);
  }

  @AuthRoles(UserRole.SuperAdmin)
  @Patch(':id')
  async updateRole(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const results = await this.rolesService.updateRole(id, updateRoleDto);
    return this.res.success(results);
  }
}
