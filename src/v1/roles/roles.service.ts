import { Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { IPagination } from '../../interfaces/pagination.interface';
import { PaginationService } from '../../utils/pagination.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetRoleDto } from './dto/get-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { RoleRepository } from './repositories/role.repository';

@Injectable()
export class RolesService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private paginationService: PaginationService,
  ) {}

  /**
   * This function is create new role
   *
   * @param createRoleDto CreateRoleDto
   * @returns Role
   */
  async createRoles(createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleRepository.create(createRoleDto);
  }

  /**
   * This function is get detail role
   *
   * @param id  number
   * @returns Role
   */
  async getDetail(id: number): Promise<Role> {
    const where = { id };
    return await this.roleRepository.findOne(where);
  }

  /**
   * This function is update role
   *
   * @param id number
   * @param updateRoleDto UpdateRoleDto
   * @returns Role
   */
  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const data = { name: updateRoleDto.name };
    return await this.roleRepository.updateOneAndReturnById(id, data);
  }

  /**
   * This function is get list rule
   *
   * @param getRoleDto GetRoleDto
   * @returns IPagination
   */
  async getList(getRoleDto: GetRoleDto): Promise<IPagination> {
    const page = getRoleDto.page ? getRoleDto.page : 1;
    const limit = getRoleDto.limit ? getRoleDto.limit : 10;
    const sortType = getRoleDto.sortType;
    const sortBy = getRoleDto.sortBy ? getRoleDto.sortBy : '';
    const keyword = getRoleDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    let where = {};

    if (getRoleDto.keyword) {
      where['name'] = Like(`%${keyword}%`);
    }

    if (sortBy) {
      order = {
        [sortBy]: sortType,
      };
    } else {
      order = {
        id: sortType,
      };
    }

    const [roles, total] = await this.roleRepository.findAndCount(
      where,
      null,
      null,
      limit,
      skip,
      order,
    );

    const result = this.paginationService.pagination(roles, total, page, limit);
    return result;
  }
}
