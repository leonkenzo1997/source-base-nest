import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { In, Like } from 'typeorm';
import { IToken } from '../../interfaces/generate-token.interface';
import { IPagination } from '../../interfaces/pagination.interface';
import { PaginationService } from '../../utils/pagination.service';
import { TokenService } from '../../utils/token.service';
import { IJwt } from '../authentication/interfaces/jwt.interface';
import { BuildingsService } from '../buildings/buildings.service';
import { UsersBuildingsFloorsService } from '../users-buildings-floors/users-buildings-floors.service';
import { UserRole } from '../users/user.const';
import { UsersService } from '../users/users.service';
import { CreateFloorDto } from './dto/create-floors.dto';
import { EditNameFloorDTO } from './dto/edit-name-floor';
import {
  GetListFloorByBuildingDTO,
  GetListFloorByUserDTO,
} from './dto/get-list-floors-by-building.dto';
import { GetListFloorDTO } from './dto/get-list-floors.dto';
import { UpdateListFloorDTO } from './dto/update-list-floors.dto';
import { FloorEntity } from './entities/floor.entity';
import { FLOOR_RELATION, FLOOR_SELECT } from './floors.const';
import { IFloor } from './interfaces/floor.interface';
import { FloorsRepository } from './repositories/floor.repository';

@Injectable()
export class FloorsService extends BaseService<FloorEntity, FloorsRepository> {
  constructor(
    private readonly floorsRepository: FloorsRepository,
    @Inject(forwardRef(() => BuildingsService))
    private buildingsService: BuildingsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private tokenService: TokenService,
    private paginationService: PaginationService,
    private usersBuildingsFloorsService: UsersBuildingsFloorsService,
  ) {
    super(floorsRepository);
  }

  /**
   * This function create floor by only admin account
   *
   * @param user IJwt
   * @param createFloorDto CreateFloorDto
   * @returns IFloor
   */
  public async createFloor(
    user: IJwt,
    createFloorDto: CreateFloorDto,
  ): Promise<IFloor> {
    // get user data
    let userData = await this.usersService.findById(user.userId);

    // get building id from user
    let buildingId = userData.building.id;

    let dataBuilding = await this.buildingsService.findById(buildingId);

    // format data to create children table users-buildings-floors
    let usersBuildingsFloors: any[] = [
      {
        building: { id: buildingId },
        user: { id: userData.id },
      },
    ];

    // handle multiple account admin
    await Promise.all(
      dataBuilding.users.map(async (item: any) => {
        if (item.role.id === UserRole.Admin) {
          // check user are creating floor , if this user create, remove this user
          if (user.userId !== item.id) {
            usersBuildingsFloors.push({
              building: { id: buildingId },
              user: { id: item.id },
            });
          }
        }
      }),
    );

    createFloorDto['usersBuildingsFloors'] = usersBuildingsFloors;
    createFloorDto['createdBy'] = {
      id: user.userId,
    };

    // check name of floor to be existed
    let checkNameFloor = await this.floorsRepository.find(
      {
        name: createFloorDto.name,
        usersBuildingsFloors: { building: { id: buildingId } },
      },
      {
        usersBuildingsFloors: { building: true },
      },
    );

    if (checkNameFloor.length > 0) {
      throw new HttpException('FLOOR_NAME_EXIST', HttpStatus.BAD_REQUEST);
    }

    // create floor data and data in children table (users-buildings-floors-floors)
    let floorData = await this.floorsRepository.create(createFloorDto);

    // check and generate provision key

    let checkProvisionKey: IFloor;
    let provisionKey: IToken;

    do {
      // generate provision key
      provisionKey = await this.tokenService.generateProvisionKey(
        buildingId,
        floorData.id,
      );

      checkProvisionKey = await this.floorsRepository.findOne({
        provisionKey: provisionKey.token,
      });
    } while (checkProvisionKey);

    //update provision key for floor
    let results = await this.floorsRepository.updateOneAndReturnById(
      floorData.id,
      {
        provisionKey: provisionKey.token,
      },
    );

    return results;
  }

  /**
   * This function check list floor when register user account
   *
   * @param arrayBuildings any[]
   * @returns boolean
   */
  async checkListFloors(arrayBuildings: any[]): Promise<boolean> {
    let newArrayFloors: any[] = [];
    await Promise.all(
      arrayBuildings.map((floor: any) => {
        newArrayFloors.push(floor.id);
      }),
    );

    let result: IFloor[] = await this.floorsRepository.find({
      id: In(newArrayFloors),
    });

    if (result.length === arrayBuildings.length) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * This function using in user management (page detail account)
   *
   * @param getListFloorByUserDTO GetListFloorByUserDTO
   * @param user IJwt
   * @returns IPagination
   */
  async getListFloorByUser(
    getListFloorByUserDTO: GetListFloorByUserDTO,
    user: IJwt,
  ): Promise<IPagination> {
    const page = getListFloorByUserDTO.page ? getListFloorByUserDTO.page : 1;

    const limit = getListFloorByUserDTO.limit
      ? getListFloorByUserDTO.limit
      : 10;

    const sortType = getListFloorByUserDTO.sortType;

    const sortBy = getListFloorByUserDTO.sortBy
      ? getListFloorByUserDTO.sortBy
      : '';

    const keyword = getListFloorByUserDTO.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    let where = {};

    let relations = {
      usersBuildingsFloors: { building: true, user: true },
    };
    let selects = {
      usersBuildingsFloors: {
        id: true,
        building: { id: true, name: true },
        user: { id: true, email: true },
      },
    };

    if (getListFloorByUserDTO.buildingId) {
      where['usersBuildingsFloors'] = {
        building: { id: getListFloorByUserDTO.buildingId },
      };
    }

    if (user.roleId !== UserRole.SuperAdmin) {
      where['usersBuildingsFloors'] = {
        ...where['usersBuildingsFloors'],
        user: { id: getListFloorByUserDTO.userId },
      };
    }

    if (getListFloorByUserDTO.keyword) {
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

    const [floors, total] = await this.floorsRepository.findAndCount(
      where,
      relations,
      selects,
      limit,
      skip,
      order,
    );

    let floorsData = floors.map((floor: any) => {
      floor.buildingId = getListFloorByUserDTO.buildingId;
      delete floor.usersBuildingsFloors;
      return floor;
    });

    // let floorsData = floors.map((floor: any) => {
    //   // check array user of array
    //   let arrayUserOfFloor = floor.usersBuildingsFloors;
    //   floor['isChoose'] = arrayUserOfFloor.some(
    //     (item: any) => item.user.id === getListFloorByUserDTO.userId,
    //   );
    //   floor.buildingId = getListFloorByBuildingDTO.buildingId;
    //   delete floor.usersBuildingsFloors;
    //   return floor;
    // });

    const result = this.paginationService.pagination(
      floorsData,
      total,
      page,
      limit,
    );

    return result;
  }

  /**
   * This function using to create account
   *
   * @param getListFloorByBuildingDTO GetListFloorByBuildingDTO
   * @returns IPagination
   */
  async getListFloorsByBuilding(
    getListFloorByBuildingDTO: GetListFloorByBuildingDTO,
  ): Promise<IPagination> {
    const page = getListFloorByBuildingDTO.page
      ? getListFloorByBuildingDTO.page
      : 1;
    const limit = getListFloorByBuildingDTO.limit
      ? getListFloorByBuildingDTO.limit
      : 10;
    const sortType = getListFloorByBuildingDTO.sortType;
    const sortBy = getListFloorByBuildingDTO.sortBy
      ? getListFloorByBuildingDTO.sortBy
      : '';
    const keyword = getListFloorByBuildingDTO.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    let where = {};

    let relations = {
      usersBuildingsFloors: { building: true, user: true },
      createdBy: true,
    };
    let selects = {
      usersBuildingsFloors: {
        id: true,
        building: { id: true, name: true },
        user: { id: true, email: true },
      },
      createdBy: { id: true, email: true },
    };

    if (getListFloorByBuildingDTO.buildingId) {
      where = {
        usersBuildingsFloors: {
          building: { id: getListFloorByBuildingDTO.buildingId },
        },
      };
    }

    if (getListFloorByBuildingDTO.keyword) {
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

    const [floors, total] = await this.floorsRepository.findAndCount(
      where,
      relations,
      selects,
      limit,
      skip,
      order,
    );

    let floorsData = floors.map((floor: any) => {
      floor.buildingId = getListFloorByBuildingDTO.buildingId;
      delete floor.usersBuildingsFloors;
      return floor;
    });

    const result = this.paginationService.pagination(
      floorsData,
      total,
      page,
      limit,
    );
    return result;
  }

  /**
   * This function is mobile using get list floor
   *
   * @param getListFloorDTO GetListFloorDTO
   * @param user IJwt
   * @returns IPagination
   */
  async getListFloors(
    getListFloorDTO: GetListFloorDTO,
    user: IJwt,
  ): Promise<IPagination> {
    const page = getListFloorDTO.page ? getListFloorDTO.page : 1;
    const limit = getListFloorDTO.limit ? getListFloorDTO.limit : 10;
    const sortType = getListFloorDTO.sortType;
    const sortBy = getListFloorDTO.sortBy ? getListFloorDTO.sortBy : '';
    const keyword = getListFloorDTO.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    let where = {};

    let relations = {
      usersBuildingsFloors: { building: true, user: true },
    };
    let selects = {
      usersBuildingsFloors: {
        id: true,
        building: { id: true, name: true },
        user: { id: true, email: true },
      },
    };

    let userData = await this.usersService.findById(user.userId);

    where = {
      usersBuildingsFloors: {
        building: { id: userData.building.id },
        user: { id: user.userId },
      },
    };

    if (getListFloorDTO.keyword) {
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

    const [floors, total] = await this.floorsRepository.findAndCount(
      where,
      relations,
      selects,
      limit,
      skip,
      order,
    );

    let floorsData = floors.map((floor: any) => {
      floor.building = userData.building;
      delete floor.usersBuildingsFloors;
      return floor;
    });

    const result = this.paginationService.pagination(
      floorsData,
      total,
      page,
      limit,
    );
    return result;
  }

  /**
   * This method change list floor for user
   *
   * @param updateListFloorDTO UpdateListFloorDTO
   * @param userId number
   * @returns void
   */
  async changeListFloorForUser(
    updateListFloorDTO: UpdateListFloorDTO,
    userId: number,
  ) {
    // find user
    let user = await this.usersService.findById(userId);

    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // check role of user to update
    if (user.role.id === UserRole.SuperAdmin) {
      throw new HttpException(
        'NOT_CHANGE_FLOOR_SUPER_ADMIN',
        HttpStatus.BAD_REQUEST,
      );
    }

    // check user having building
    if (!user?.building) {
      throw new HttpException('USER_NOT_BUILDING', HttpStatus.BAD_REQUEST);
    }

    let dataBuilding = await this.buildingsService.findById(user.building.id);

    let data = {
      building: { id: dataBuilding.id },
      user: { id: userId },
    };

    let arraysUserBuildingFloor: any[] = [];

    // handle data of floor to update floor of user
    await Promise.all(
      updateListFloorDTO.arrayFloors.map((floor: any) => {
        // check floor update must be the same floor inside of building
        let checkFloor = dataBuilding.floors.some((item: any) => {
          return floor.id === item.id;
        });

        if (!checkFloor) {
          throw new HttpException(
            'FLOOR_NOT_EXIST_IN_BUILDING',
            HttpStatus.BAD_REQUEST,
          );
        }
        arraysUserBuildingFloor.push({
          building: { id: dataBuilding.id },
          user: { id: userId },
          floor: { id: floor.id },
        });
      }),
    );

    // remove all floor of user
    await this.usersBuildingsFloorsService.delete(data);

    // create data for user-building-floor in table
    // update floor for user
    await this.usersBuildingsFloorsService.create(arraysUserBuildingFloor);

    // return new user data when update to be done
    let result = await this.usersService.findById(userId);

    return result;
  }

  /**
   * This method edit name of floor by floor id
   *
   * @param userId number
   * @param id number
   * @param data EditNameFloorDTO
   * @returns IFloor
   */
  async editNameFloor(
    userId: number,
    id: number,
    data: EditNameFloorDTO,
  ): Promise<IFloor> {
    let floor = await this.findById(id);

    let user = await this.usersService.findById(userId);

    // in case: prevent hacker can use some tool to edit floors name
    // check building of user with building of floor
    if (user.building.id !== floor.building.id) {
      throw new HttpException(
        'BUILDING_USER_NOT_MATCH_BUILDING_FLOOR',
        HttpStatus.BAD_REQUEST,
      );
    }

    let checkNameFloors = await this.floorsRepository.findOne({
      name: data.name,
      usersBuildingsFloors: { building: { id: floor.building.id } },
    });

    if (checkNameFloors) {
      throw new HttpException('FLOOR_NAME_EXIST', HttpStatus.BAD_REQUEST);
    }

    let results = await this.floorsRepository.updateOneAndReturnById(id, data);

    return results;
  }

  /**
   * This method delete group by id and user login
   *
   * @param userData IJwt
   * @param id number
   * @returns void
   */
  // delete floor
  public async deleteFloor(userData: IJwt, id: number): Promise<void> {
    //check floor in system
    let floor = await this.findById(id);

    if (!floor) {
      throw new HttpException('FLOOR_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // check floor(which want to delete) with list floor of user
    await this.checkFloorWithFloorUserViaUserId(userData.userId, floor);

    await Promise.all(
      floor.zones.map(async (zone: any) => {
        await Promise.all(
          zone.groups.map((group: any) => {
            if (group.devices.length > 0) {
              throw new HttpException(
                'DEVICE_EXIST_IN_GROUP',
                HttpStatus.BAD_REQUEST,
              );
            }
          }),
        );
        if (zone.devices.length > 0) {
          throw new HttpException(
            'DEVICE_EXIST_IN_ZONE',
            HttpStatus.BAD_REQUEST,
          );
        }
      }),
    );

    // check device have existed in floor
    if(floor.devices.length >0){
      throw new HttpException(
        'DEVICE_EXIST_IN_FLOOR',
        HttpStatus.BAD_REQUEST,
      );
    }

    // delete floor and all table have relationship with floor
    await this.floorsRepository.softRemove(
      //id of floor
      id,
      //relationship with data
      {
        usersBuildingsFloors: true,
        zones: {
          groups: true,
          deleteGroup: true,
        },
        deleteZone: true,
        scene: { sceneSettings: { sceneSettingArea: true } },
        deleteScene: true,
        schedules: true,
        deleteSchedule: true,
      },
    );
  }

  /**
   * This method get floor with list zone group
   *
   * @param userData IJwt
   * @param id number
   * @returns any
   */
  public async getListFloorZoneGroup(
    userData: IJwt,
    id: number,
  ): Promise<IFloor> {
    //check floor with floor user
    await this.checkFloorWithFloorUser(userData, id);

    let results = await this.floorsRepository.findOne(
      {
        id: id,
      },
      {
        zones: { groups: true },
      },
      {
        id: true,
        name: true,
        zones: {
          id: true,
          name: true,
          protocolZoneId: true,
          groups: { id: true, name: true, protocolGroupId: true },
        },
      },
    );

    return results;
  }

  /**
   * This function is find By id of floors
   *
   * @param id number
   * @returns IFloor
   */
  private async findById(id: number): Promise<IFloor> {
    const where = { id };
    let floor = await this.floorsRepository.findOne(
      where,
      FLOOR_RELATION,
      FLOOR_SELECT,
    );

    if (!floor) {
      return floor;
    }

    let results = await this.handleFloors(floor);
    return results;
  }

  /**
   * This function is find By id of floors
   * @param id
   * @returns
   */
  public async getDetailFloors(id: number): Promise<IFloor> {
    let floor = await this.findById(id);

    if (!floor) {
      throw new HttpException('FLOOR_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return floor;
  }

  /**
   * This function is handle floor
   *
   * @param data IFloor
   * @returns IFloor
   */
  private async handleFloors(data: IFloor): Promise<IFloor> {
    let buildingArray: any = [];
    let newBuildingsArray: any[] = [];

    let usersArray: any = [];
    let newUsersArray: any[] = [];

    //handle user of floor and building of floor
    data.usersBuildingsFloors.map((item: any) => {
      // check item of floor and ignore the same floor data
      if (item.user) {
        if (!newUsersArray[item.user.id]) {
          newUsersArray[item.user.id] = item.user.id;
          usersArray.push(item.user);
        }
      }

      if (item.building) {
        // check item of floor and ignore the same floor data
        if (!newBuildingsArray[item.building.id]) {
          newBuildingsArray[item.building.id] = item.building.id;
          buildingArray.push(item.building);
        }
        delete item.id;
        return item;
      }
    });

    data['building'] = buildingArray[0];
    data['users'] = usersArray;
    delete data.usersBuildingsFloors;
    let floorData = data;
    return floorData;
  }

  /**
   * This function to get and check data of floor
   *
   * @param user IJwt
   * @param floorId number
   * @returns IFloor
   */
  async getAndCheckFloor(user: IJwt, floorId: number): Promise<IFloor> {
    //check floor exist
    let floorData: IFloor = await this.getDetailFloors(floorId);

    if (user.roleId === UserRole.Admin) {
      // check floor with floor of user
      await this.checkFloorWithFloorUserViaUserId(user.userId, floorData);
    }

    return floorData;
  }

  /**
   * This method check floor with floor of user by userid
   *
   * @param userId number
   * @param floorData IFloor
   * @returns void
   */
  public async checkFloorWithFloorUserViaUserId(
    userId: number,
    floorData: IFloor,
  ): Promise<void> {
    // check floor(which want to delete) with list floor of user
    let checkFloor = floorData.users.some((floor: any) => floor.id === userId);

    if (!checkFloor) {
      throw new HttpException(
        'FLOOR_NOT_MATCH_USER_FLOOR',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * This method check floor with user floor
   *
   * @param userData IJwt
   * @param id number
   * @returns void
   */
  public async checkFloorWithFloorUser(
    userData: IJwt,
    id: number,
  ): Promise<void> {
    let floor = await this.getDetailFloors(id);

    let checkFloor = floor.users.some(
      (item: any) => item.id === userData.userId,
    );

    if (!checkFloor) {
      throw new HttpException(
        'FLOOR_NOT_MATCH_USER_FLOOR',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * This method get floor with list zone group for web
   *
   * @param userData IJwt
   * @param id number
   * @returns any
   */
  public async getListFloorZoneGroupForWeb(id: number): Promise<IFloor> {
    //check floor with floor user
    let results = await this.floorsRepository.findOne(
      {
        id: id,
      },
      {
        zones: { groups: true },
      },
      {
        id: true,
        name: true,
        zones: {
          id: true,
          name: true,
          protocolZoneId: true,
          groups: { id: true, name: true, protocolGroupId: true },
        },
      },
    );

    let listZone = results.zones;
    delete results.zones;
    results['zone'] = listZone;

    for (let zone of results['zone']) {
      let group = zone.groups;

      delete zone.groups;

      zone['group'] = group;
    }

    return results;
  }
}
