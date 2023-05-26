import { Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { IPagination } from './../../interfaces/pagination.interface';
import { PaginationService } from './../../utils/pagination.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetRoleDto } from './dto/get-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { RoleRepository } from './repositories/role.repository';

@Injectable()
export class RolesService {
  constructor(
    // @InjectRepository(Role)
    // private roleRepository: Repository<Role>,
    private readonly roleRepository: RoleRepository,
    private paginationService: PaginationService,
  ) {}

  // create roles
  async createRoles(createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleRepository.create(createRoleDto);
  }

  // get detail rule
  async getDetail(id: number): Promise<Role> {
    const where = { id };
    return await this.roleRepository.findOne(where);
  }

  // get detail rule
  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const data = { name: updateRoleDto.name };
    return await this.roleRepository.updateOneAndReturnById(id, data);
  }

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
        [sortBy]: [sortType],
      };
      console.log('order :>> ', order);
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
