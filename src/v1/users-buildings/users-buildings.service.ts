import { Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { UserRole } from '../users/user.const';
import { IPagination } from '../../interfaces/pagination.interface';
import { PaginationService } from '../../utils/pagination.service';
import { GetUserBuildingDto } from './dto/get-users-buildings.dto';
import { UserBuildingRepository } from './repositories/users-building.repository';

@Injectable()
export class UserBuildingService {
  constructor(
    private readonly userBuildingRepository: UserBuildingRepository,
    private paginationService: PaginationService,
  ) {}

  /**
   * This function is get account admin by id building assign
   *
   * @param getUserBuildingDto GetUserBuildingDto
   * @returns IPagination
   */
  async getAdminAccountByBuilding(
    getUserBuildingDto: GetUserBuildingDto,
  ): Promise<IPagination> {
    const page = getUserBuildingDto.page ? getUserBuildingDto.page : 1;
    const limit = getUserBuildingDto.limit ? getUserBuildingDto.limit : 10;
    const sortType = getUserBuildingDto.sortType;
    const sortBy = getUserBuildingDto.sortBy ? getUserBuildingDto.sortBy : '';
    const keyword = getUserBuildingDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};

    let where = {
      building: { id: getUserBuildingDto.buildingId },
      user: { role: { id: UserRole.Admin } },
    };

    // select for children table and parent table
    let relations = {
      user: { role: true, rules: { rule: true } },
      building: true,
    };

    // select for children table and parent table
    let selects = {
      id: true,
      building: { id: true, address: true, name: true },
      user: {
        id: true,
        email: true,
        fullName: true,
        role: { id: true, name: true },
        rules: {
          id: true,
          rule: {
            id: true,
            name: true,
          },
        },
      },
    };

    if (getUserBuildingDto.keyword) {
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

    // get data and total data
    const [usersBuildings, total] =
      await this.userBuildingRepository.findAndCount(
        where,
        relations,
        selects,
        limit,
        skip,
        order,
      );

    const result : IPagination = this.paginationService.pagination(
      usersBuildings,
      total,
      page,
      limit,
    );
    return result;
  }

  /**
   * This function is get account user by id building assign
   *
   * @param getUserBuildingDto GetUserBuildingDto
   * @returns IPagination
   */
  async getUserAccountByBuilding(
    getUserBuildingDto: GetUserBuildingDto,
  ): Promise<IPagination> {
    const page = getUserBuildingDto.page ? getUserBuildingDto.page : 1;
    const limit = getUserBuildingDto.limit ? getUserBuildingDto.limit : 10;
    const sortType = getUserBuildingDto.sortType;
    const sortBy = getUserBuildingDto.sortBy ? getUserBuildingDto.sortBy : '';
    const keyword = getUserBuildingDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};

    let where = {
      building: { id: getUserBuildingDto.buildingId },
      user: { role: { id: UserRole.User } },
    };

    // select for children table and parent table
    let relations = {
      user: { role: true, rules: { rule: true } },
      building: true,
    };

    // select for children table and parent table
    let selects = {
      id: true,
      building: { id: true, address: true, name: true },
      user: {
        id: true,
        email: true,
        fullName: true,
        role: { id: true, name: true },
        rules: {
          id: true,
          rule: {
            id: true,
            name: true,
          },
        },
      },
    };

    if (getUserBuildingDto.keyword) {
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

    // get data and total data
    const [usersBuildings, total] =
      await this.userBuildingRepository.findAndCount(
        where,
        relations,
        selects,
        limit,
        skip,
        order,
      );

    const result = this.paginationService.pagination(
      usersBuildings,
      total,
      page,
      limit,
    );
    return result;
  }
}
