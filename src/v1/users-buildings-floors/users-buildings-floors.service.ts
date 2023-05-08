import { Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { IPagination } from '../../interfaces/pagination.interface';
import { PaginationService } from '../../utils/pagination.service';
import { UserRole } from '../users/user.const';
import { CreateUserBuildingFloorDto } from './dto/create-users-buildings-floors.dto';
import { DataDeleteUserBuildingFloorDTO } from './dto/data-delete-users-buildings-users.dto';
import { GetUserBuildingFloorByBuildingIdDto } from './dto/get-users-buildings-floors-by-building-id.dto';
import { UserBuildingFloor } from './entities/user-building-floor.entity';
import { UserBuildingFloorRepository } from './repositories/users-buildings-floors.repository';

@Injectable()
export class UsersBuildingsFloorsService {
  constructor(
    private readonly userBuildingFloorRepository: UserBuildingFloorRepository,
    private paginationService: PaginationService,
  ) {}

  /**
   * This function is get account admin by id building assign
   *
   * @param getUserBuildingFloorByBuildingIdDto GetUserBuildingFloorByBuildingIdDto
   * @returns IPagination
   */
  async getAdminAccountByBuilding(
    getUserBuildingFloorByBuildingIdDto: GetUserBuildingFloorByBuildingIdDto,
  ): Promise<IPagination> {
    const page = getUserBuildingFloorByBuildingIdDto.page
      ? getUserBuildingFloorByBuildingIdDto.page
      : 1;
    const limit = getUserBuildingFloorByBuildingIdDto.limit
      ? getUserBuildingFloorByBuildingIdDto.limit
      : 10;
    const sortType = getUserBuildingFloorByBuildingIdDto.sortType;
    const sortBy = getUserBuildingFloorByBuildingIdDto.sortBy
      ? getUserBuildingFloorByBuildingIdDto.sortBy
      : '';
    const keyword = getUserBuildingFloorByBuildingIdDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};

    let where = {
      building: { id: getUserBuildingFloorByBuildingIdDto.buildingId },
      user: { role: { id: UserRole.Admin } },
    };

    // select for children table and parent table
    let relations = {
      user: { role: true, rules: { rule: true } },
      building: true,
      floor: true,
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
      floor: { id: true, name: true },
    };

    if (getUserBuildingFloorByBuildingIdDto.keyword) {
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
      await this.userBuildingFloorRepository.findAndCount(
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

  /**
   * This function is get account user by id building assign
   *
   * @param getUserBuildingFloorByBuildingIdDto GetUserBuildingFloorByBuildingIdDto
   * @returns IPagination
   */
  async getUserAccountByBuilding(
    getUserBuildingFloorByBuildingIdDto: GetUserBuildingFloorByBuildingIdDto,
  ): Promise<IPagination> {
    const page = getUserBuildingFloorByBuildingIdDto.page
      ? getUserBuildingFloorByBuildingIdDto.page
      : 1;
    const limit = getUserBuildingFloorByBuildingIdDto.limit
      ? getUserBuildingFloorByBuildingIdDto.limit
      : 10;
    const sortType = getUserBuildingFloorByBuildingIdDto.sortType;
    const sortBy = getUserBuildingFloorByBuildingIdDto.sortBy
      ? getUserBuildingFloorByBuildingIdDto.sortBy
      : '';
    const keyword = getUserBuildingFloorByBuildingIdDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};

    let where = {
      building: { id: getUserBuildingFloorByBuildingIdDto.buildingId },
      user: { role: { id: UserRole.User } },
    };

    // select for children table and parent table
    let relations = {
      user: { role: true, rules: { rule: true } },
      building: true,
      floor: true,
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
      floor: { id: true, name: true },
    };

    if (getUserBuildingFloorByBuildingIdDto.keyword) {
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
      await this.userBuildingFloorRepository.findAndCount(
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

  async getUserAccountByUserId(userId: number) {
    let where = { user: { id: userId } };
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

    let results = await this.userBuildingFloorRepository.findOne(where);

    return results;
  }

  async delete(data: DataDeleteUserBuildingFloorDTO): Promise<void> {
    await this.userBuildingFloorRepository.delete(data);
  }

  async create(
    createUserBuildingFloorDto: CreateUserBuildingFloorDto[],
  ): Promise<UserBuildingFloor> {
    let results = await this.userBuildingFloorRepository.insert(
      createUserBuildingFloorDto,
    );
    return results;
  }
}
