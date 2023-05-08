import { In } from 'typeorm';
/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Like } from 'typeorm';
import { BaseService } from '../../base/base.service';
import { IPagination } from '../../interfaces/pagination.interface';
import { PaginationService } from '../../utils/pagination.service';
import { IJwt } from '../authentication/interfaces/jwt.interface';
import { UserRole } from '../users/user.const';
import { UsersService } from '../users/users.service';
import { CreateBuildingDto } from './dto/create-buildings.dto';
import { GetBuildingDto } from './dto/get-buildings.dto';
import { UpdateBuildingDto } from './dto/update-buildings.dto';
import { Building } from './entities/building.entity';
import { IBuilding } from './interfaces/building.interface';
import { BuildingRepository } from './repositories/buildings.repository';
import { BUILDING_RELATION, BUILDING_SELECT } from './buildings.const';

@Injectable()
export class BuildingsService extends BaseService<
  Building,
  BuildingRepository
> {
  constructor(
    private readonly buildingRepository: BuildingRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private paginationService: PaginationService,
  ) {
    super(buildingRepository);
  }

  /**
   * This method is find all building entities
   *
   * @param userId number
   * @param getBuildingDto GetBuildingDto
   * @returns IPagination
   */
  public async findAllBuilding(
    user: IJwt,
    getBuildingDto: GetBuildingDto,
  ): Promise<IPagination> {
    if (!user) {
      throw new BadRequestException('ACCOUNT_NOT_REGISTERED');
    } else {
      const page = getBuildingDto.page ? getBuildingDto.page : 1;
      const limit = getBuildingDto.limit ? getBuildingDto.limit : 10;
      const sortType = getBuildingDto.sortType;
      const sortBy = getBuildingDto.sortBy ? getBuildingDto.sortBy : '';
      const keyword = getBuildingDto.keyword;
      const skip = (page - 1) * limit;
      let order = {};
      const where = {};

      if (getBuildingDto.keyword) {
        where['name'] = Like(`%${keyword}%`);
      }

      if (user.roleId === UserRole.Admin) {
        const building = await (
          await this.userService.findById(user.userId)
        ).building;

        if (building) {
          where['id'] = building.id;
        } else {
          where['id'] = -1;
        }
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

      const [building, total] = await this.buildingRepository.findAndCount(
        where,
        null,
        null,
        limit,
        skip,
        order,
      );
      const result = this.paginationService.pagination(
        building,
        total,
        page,
        limit,
      );
      return result;
    }
  }

  /**
   * this method is update building by data input
   *
   * @param userId number
   * @param updateBuildingDto UpdateBuildingDto
   * @returns Building
   */
  public async updateBuilding(
    userId: number,
    updateBuildingDto: UpdateBuildingDto,
    buildingId: number,
  ): Promise<IBuilding> {
    // check data input null
    if (!updateBuildingDto) {
      throw new BadRequestException('INVALID_DATA');
    }
    const building = await this.buildingRepository.findOne({
      id: buildingId,
    });

    // check user register
    if (!userId) {
      throw new BadRequestException('ACCOUNT_NOT_REGISTERED');
    }
    // check building already
    else if (!building) {
      throw new BadRequestException('BUILDING_NOT_FOUND');
    } else {
      if (updateBuildingDto.name === building.name) {
        throw new BadRequestException('NAME_ADDRESS_NOT_ALREADY');
      }
      const listBuilding = await this.buildingRepository.find(null);
      // check name and address in building already
      for (const buildings of listBuilding) {
        if (
          buildings.name === updateBuildingDto.name ||
          buildings.address === updateBuildingDto.address
        ) {
          throw new BadRequestException('NAME_ADDRESS_NOT_ALREADY');
        }
      }

      return await this.buildingRepository.updateOneAndReturnById(
        buildingId,
        updateBuildingDto,
      );
    }
  }

  /**
   * this method is create building by id user and data building
   *
   * @param userId number
   * @param createBuildingDto CreateBuildingDto
   * @returns Building
   */
  public async createBuilding(
    userId: number,
    createBuildingDto: CreateBuildingDto,
  ): Promise<IBuilding> {
    // check user is register
    if (!userId) {
      throw new BadRequestException('ACCOUNT_NOT_REGISTERED');
    } else {
      // check name is register
      const buildingName = await this.buildingRepository.findOne({
        name: createBuildingDto.name,
      });

      if (buildingName) {
        throw new HttpException('BUILDING_NAME_REGISTERED', HttpStatus.FOUND);
      }

      // check address is register
      const buildingAddress = await this.buildingRepository.findOne({
        address: createBuildingDto.address,
      });
      if (buildingAddress) {
        throw new HttpException(
          'BUILDING_ADDRESS_REGISTERED',
          HttpStatus.FOUND,
        );
      }
      createBuildingDto['createdBy'] = userId;
      const result = await this.buildingRepository.create({
        ...createBuildingDto,
      });
      return result;
    }
  }

  /**
   * this method is delete one record entity building by id user and id building
   *
   * @param userId number
   * @param buildingId number
   * @returns any
   */
  public async removeBuilding(
    userId: number,
    buildingId: number,
  ): Promise<any> {
    const building = await this.buildingRepository.findOne({ id: buildingId });

    // check user is register
    if (!userId) {
      throw new BadRequestException('ACCOUNT_NOT_REGISTERED');
    }
    // check building is already
    else if (!building) {
      throw new BadRequestException('BUILDING_NOT_FOUND');
    } else {
      await this.buildingRepository.softRemove(buildingId, {
        usersBuildings: true,
        usersBuildingsFloors: {
          floor: {
            usersBuildingsFloors: true,
            sceneSettingArea: true,
            zones: {
              groups: true,
              deleteGroup: true,
            },
            scene: { sceneSettings: { sceneSettingArea: true } },
            deleteScene: true,
            schedules: true,
            deleteSchedule: true,
          },
        },
      });
    }
  }

  /**
   * this method get detail building by id building
   *
   * @param id number
   * @returns Building
   */
  public async detailBuilding(id: number): Promise<IBuilding> {
    let building = await this.buildingRepository.findOne(
      { id: id },
      {
        usersBuildings: { user: true },
        usersBuildingsFloors: { floor: true },
        createdBy: true,
      },
      {
        usersBuildings: { id: true, user: { id: true, email: true } },
        usersBuildingsFloors: { id: true, floor: { id: true, name: true } },
        createdBy: { id: true, userName: true, email: true, fullName: true },
      },
    );

    let result = await this.handleBuilding(building);

    return result;
  }

  /**
   * this method get detail building by id building
   *
   * @param id number
   * @returns Building
   */
  public async findById(id: number): Promise<IBuilding> {
    let building = await this.buildingRepository.findOne(
      { id: id },
      BUILDING_RELATION,
      BUILDING_SELECT,
    );

    if (!building) {
      return building;
    }

    let result = await this.handleBuilding(building);

    return result;
  }

  /**
   * This function is handle data building
   *
   * @param data IBuilding
   * @returns IBuilding
   */
  public async handleBuilding(data: IBuilding): Promise<IBuilding> {
    let floorsArray: any = [];
    let newFloorsArray: any[] = [];
    let user: any[] = [];

    data.usersBuildings.map((item: any) => {
      user.push(item.user);
      return item;
    });

    //handle floor of building
    data.usersBuildingsFloors.map((item: any) => {
      // check item of floor and ignore the same floor data
      if (!newFloorsArray[item.floor.id]) {
        newFloorsArray[item.floor.id] = item.floor.id;
        floorsArray.push(item.floor);
      }
      return item;
    });

    data['users'] = user;
    data['floors'] = floorsArray;
    delete data.usersBuildingsFloors;
    delete data.usersBuildings;
    let userData = data;
    return userData;
  }

  /**
   * This function check list building found
   *
   * @param arrayBuildings any[]
   * @returns boolean
   */
  async checkListBuilding(arrayBuildings: any[]): Promise<boolean> {
    let newArrayBuildings: any[] = [];
    await Promise.all(
      arrayBuildings.map((building: any) => {
        newArrayBuildings.push(building.id);
      }),
    );

    let result: Building[] = await this.buildingRepository.find({
      id: In(newArrayBuildings),
    });

    if (result.length === arrayBuildings.length) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * This method check name buildings
   *
   * @param name string
   * @returns Building
   */
  public async checkNameBuilding(name: string): Promise<any> {
    const building = await this.buildingRepository.findOne({ name: name });

    if (building) {
      throw new BadRequestException('BUILDING_NAME_REGISTERED');
    }

    return true;
  }
}
