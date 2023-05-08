import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { In, Like } from 'typeorm';
import { BaseService } from '../../base/base.service';
import { IPagination } from '../../interfaces/pagination.interface';
import { PaginationService } from '../../utils/pagination.service';
import { IJwt } from '../authentication/interfaces/jwt.interface';
import { DeviceType } from '../device-types/device-types.const';
import { DevicesService } from '../devices/devices.service';
import { FloorsService } from '../floors/floors.service';
import { IFloor } from '../floors/interfaces/floor.interface';
import { IUser } from '../users/interfaces/user.interface';
import { UserRole } from '../users/user.const';
import { UsersService } from '../users/users.service';
import { CreateZonesDto } from './dto/create-zones.dto';
import { GetZonesDto, GetZonesGatewayDto } from './dto/get-zones.dto';
import { UpdateZonesDto } from './dto/update-zones.dto';
import { ZoneEntity } from './entities/zone.entity';
import { IZone } from './interfaces/zone.interface';
import { DeleteZonesRepository } from './repositories/delete-zone.repository';
import { ZonesRepository } from './repositories/zones.repository';
import {
  LIST_ZONE_RELATION,
  LIST_ZONE_SELECT,
  ZONE_RELATION,
  ZONE_SELECT,
} from './zones.const';

@Injectable()
export class ZonesService extends BaseService<ZoneEntity, ZonesRepository> {
  constructor(
    private readonly zonesRepository: ZonesRepository,
    private readonly deleteZonesRepository: DeleteZonesRepository,
    private paginationService: PaginationService,
    private readonly floorsService: FloorsService,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => DevicesService))
    private readonly devicesService: DevicesService,
  ) {
    super(zonesRepository);
  }

  /**
   * This method create zone
   *
   * @param user IJwt
   * @param createZonesDto CreateZonesDto
   * @returns IZone
   */
  async createZones(
    user: IJwt,
    createZonesDto: CreateZonesDto,
  ): Promise<IZone> {
    let floor: IFloor = await this.floorsService.getDetailFloors(
      createZonesDto.floor,
    );

    // check floor have to contain user. if contains, we can create, otherwise we can not create
    let checkFloor = floor.users.some((item: any) => item.id === user.userId);

    if (!checkFloor) {
      throw new HttpException(
        'ZONE_FLOOR_NOT_MATCH_USER_FLOOR',
        HttpStatus.BAD_REQUEST,
      );
    }

    // check quantity zone
    if (floor.zones.length >= 255) {
      throw new BadRequestException('LIMIT_ZONE_OF_FLOOR');
    }

    // check name zone create
    let checkName = floor.zones.some(
      (item: any) => item.name === createZonesDto.name,
    );

    if (checkName) {
      throw new BadRequestException('NAME_ZONE_REGISTERED');
    }

    // check data delete of zone
    const deleteZone = await this.deleteZonesRepository.findOne(
      {
        floor: { id: floor.id },
        buildingId: floor.building.id,
      },
      null,
      null,
      { protocolZoneId: 'ASC' },
    );

    delete createZonesDto.floor;

    let results;

    let zoneCreate: any = {
      ...createZonesDto,
      floor: { id: floor.id },
      buildingId: floor.building.id,
    };

    if (deleteZone) {
      zoneCreate = {
        ...zoneCreate,
        protocolZoneId: deleteZone.protocolZoneId,
      };

      results = await this.zonesRepository.create(zoneCreate);

      await this.deleteZonesRepository.softRemove(deleteZone.id);
    } else {
      zoneCreate = {
        ...zoneCreate,
        protocolZoneId: floor.zones.length + 1,
      };

      results = await this.zonesRepository.create(zoneCreate);
    }

    return results;
  }

  /**
   * This method update name zone by zone id
   *
   * @param id number (floor id )
   * @param user IJwt
   * @param updateZonesDto UpdateZonesDto
   * @returns IZone
   */
  async updateZone(
    id: number,
    user: IJwt,
    updateZonesDto: UpdateZonesDto,
  ): Promise<IZone> {
    // find and check zone exist
    const zone = await this.getDetail(id);

    // check floor of zone with floor of user
    await this.checkFloorOfZoneWithFloorOfUserByZone(user, zone);

    // check name zone update
    let checkName = await this.zonesRepository.findOne({
      name: updateZonesDto.name,
      floor: { id: zone.floor.id },
    });

    if (checkName) {
      throw new BadRequestException('NAME_ZONE_REGISTERED');
    }

    const data = { name: updateZonesDto.name };
    return await this.zonesRepository.updateOneAndReturnById(id, data);
  }

  /**
   * This method get list zone by floor id
   *
   * @param user IJwt
   * @param floorId number
   * @param getZonesDto GetZonesDto
   * @returns IPagination
   */
  async getList(
    floorId: number,
    user: IJwt,
    getZonesDto: GetZonesDto,
  ): Promise<IPagination> {
    const floor = await this.floorsService.getDetailFloors(floorId);

    if (!floor) {
      throw new HttpException('FLOOR_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    // check floor assign user login (user and admin account)
    if (user.roleId === UserRole.Admin || user.roleId === UserRole.User) {
      let checkFloor = floor.users.some((item: any) => item.id === user.userId);

      if (!checkFloor) {
        throw new HttpException(
          'ZONE_FLOOR_NOT_MATCH_USER_FLOOR',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const page = getZonesDto.page ? getZonesDto.page : 1;
    const limit = getZonesDto.limit ? getZonesDto.limit : 10;
    const sortType = getZonesDto.sortType;
    const sortBy = getZonesDto.sortBy ? getZonesDto.sortBy : '';
    const keyword = getZonesDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    let where = {};

    if (getZonesDto.keyword) {
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

    where = {
      ...where,
      floor: { id: floorId },
    };

    let [zones, total] = await this.zonesRepository.findAndCount(
      where,
      LIST_ZONE_RELATION,
      LIST_ZONE_SELECT,
      limit,
      skip,
      order,
    );

    // check zone have already existed
    // assign flag = true if zone have already existed
    zones.map((itemZone: any) => {
      if (itemZone.devices.length > 0) {
        itemZone['isSmartSwitch'] = false;
        itemZone.devices.map((itemDevice: any) => {
          if (itemDevice.deviceTypeId === DeviceType.SmartSwitch) {
            itemZone['isSmartSwitch'] = true;
          }
        });
      } else {
        itemZone['isSmartSwitch'] = false;
      }

      // if (itemZone.gatewayManageArea) {
      //   itemZone['isChoose'] = true;
      //   delete itemZone.gatewayManageArea;
      // } else {
      //   itemZone['isChoose'] = false;
      //   delete itemZone.gatewayManageArea;
      // }
    });

    const result = this.paginationService.pagination(zones, total, page, limit);

    return result;
  }

  /**
   * This method delete zone by id and user login
   *
   * @param user IReqUser
   * @param id number
   * @returns void
   */
  public async deleteZone(user: IJwt, id: number): Promise<void> {
    // already check zone not found
    const zone: IZone = await this.getDetail(id);

    // check floor of user with floor of zone
    await this.checkFloorOfZoneWithFloorOfUserByZone(user, zone);

    // check device have existed in group
    await Promise.all(
      zone.groups.map((item: any) => {
        if (item.devices.length > 0) {
          throw new HttpException(
            'DEVICE_EXIST_IN_GROUP',
            HttpStatus.BAD_REQUEST,
          );
        }
      }),
    );

    // check device have existed in zone
    if(zone.devices.length >0){
      throw new HttpException(
        'DEVICE_EXIST_IN_ZONE',
        HttpStatus.BAD_REQUEST,
      );
    }

    // create data delete of zone to
    await this.deleteZonesRepository.create({
      protocolZoneId: zone.protocolZoneId,
      floorId: zone.floor.id,
      buildingId: zone.buildingId,
    });

    return await this.zonesRepository.softRemove(id, {
      groups: true,
      deleteGroup: true,
      sceneSettingArea: true,
    });
  }

  /**
   * This method get detail zone by id
   *
   * @param id number
   * @returns IZone
   */
  async getDetail(id: number): Promise<IZone> {
    const zone = await this.findById(id);

    if (!zone) {
      throw new HttpException('ZONE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return zone;
  }

  // find By id of floors
  public async findById(id: number): Promise<IZone> {
    const where = { id };

    let zone: IZone = await this.zonesRepository.findOne(
      where,
      ZONE_RELATION,
      ZONE_SELECT,
    );
    if (!zone) {
      return zone;
    }

    let results = await this.handleZones(zone);

    return results;
  }

  public async handleZones(data: IZone): Promise<IZone> {
    let usersArray: any = [];
    let newUsersArray: any[] = [];

    //handle floor of building
    data.floor.usersBuildingsFloors.map((item: any) => {
      // check item of floor and ignore the same floor data
      if (!newUsersArray[item.user.id]) {
        newUsersArray[item.user.id] = item.user.id;
        usersArray.push(item.user);
      }
      delete item.id;
      return item;
    });

    data.floor['users'] = usersArray;
    delete data.floor.usersBuildingsFloors;
    let userData = data;
    return userData;
  }

  // check floor of group with floor of user via floor data
  public async checkFloorOfZoneWithFloorOfUserByZone(
    user: IJwt,
    zone: IZone,
  ): Promise<void> {
    // check floor assign user login
    let checkFloor = zone.floor.users.some(
      (item: any) => item.id === user.userId,
    );

    if (!checkFloor) {
      throw new HttpException(
        'ZONE_FLOOR_NOT_MATCH_USER_FLOOR',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // check floor of group with floor of user through user data
  public async checkFloorOfZoneWithFloorOfUserByUser(
    user: IJwt,
    zone: IZone,
  ): Promise<void> {
    let userData: IUser = await this.usersService.findById(user.userId);

    // check floorId of user === floorId of zone
    let checkFloor = userData.floors.some(
      (floor: any) => floor.id === zone.floor.id,
    );

    if (!checkFloor) {
      throw new HttpException(
        'ZONE_FLOOR_NOT_MATCH_USER_FLOOR',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * This method check floor with floor of user by userid
   *
   * @param floor IFloor
   * @param zoneData IZone
   * @returns void
   */
  public async checkZoneOfFloor(floor: IFloor, zoneData: IZone): Promise<void> {
    // check zone with zone of floor
    let checkZoneOfFloor = floor.zones.some(
      (zone: any) => zone.id === zoneData.id,
    );

    if (!checkZoneOfFloor) {
      throw new HttpException(
        'ZONE_NOT_MATCH_ZONE_OF_FLOOR',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * This function to get and check data of zone
   *
   * @param floorData IFloor
   * @param zoneId number
   * @returns IFloor
   */
  async getAndCheckZone(floorData: IFloor, zoneId: number): Promise<IZone> {
    //check zone exist
    let zoneData: IZone = await this.getDetail(zoneId);

    // check zone with zone of floor
    await this.checkZoneOfFloor(floorData, zoneData);

    return zoneData;
  }

  /**
   * This method is get list zone by gateway

   * @param gatewayId number
   * @param getZonesDto GetZonesDto
   * @returns IPagination
   */
  public async getListZoneByGatewayFromWeb(
    gatewayId: number,
    getZonesDto: GetZonesDto,
  ): Promise<IPagination> {
    const page = getZonesDto.page ? getZonesDto.page : 1;
    const limit = getZonesDto.limit ? getZonesDto.limit : 10;
    const sortType = getZonesDto.sortType;
    const sortBy = getZonesDto.sortBy ? getZonesDto.sortBy : '';
    const keyword = getZonesDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    let where = {};

    if (getZonesDto.keyword) {
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

    where = {
      ...where,
      gatewayManageArea: { device: { id: gatewayId } },
    };

    let [zones, total] = await this.zonesRepository.findAndCount(
      where,
      null,
      null,
      limit,
      skip,
      order,
    );

    const result = this.paginationService.pagination(zones, total, page, limit);

    return result;
  }

  /**
   * This method is get list zone by gateway

   * @param gatewayId number
   * @param getZonesDto GetZonesDto
   * @param user IJwt
   * @returns IPagination
   */
  public async getListZoneByGatewayFromMobile(
    gatewayId: number,
    getZonesDto: GetZonesDto,
    user: IJwt,
  ): Promise<IPagination> {
    const results = await this.getListZoneByGatewayFromWeb(
      gatewayId,
      getZonesDto,
    );

    return results;
  }

  /**
   * This method get list zone by floor id
   *
   * @param gatewayId number
   * @param getZonesDto GetZonesDto
   * @param user IJwt
   * @returns IPagination
   */
  async getListZoneByGateway(
    gatewayId: number,
    getZonesDto: GetZonesGatewayDto,
    user: IJwt,
  ): Promise<IPagination> {
    // check device is exist
    const device = await this.devicesService.getDetailDevice(gatewayId);

    // check floor exist
    const floor = await this.floorsService.getDetailFloors(getZonesDto.floorId);

    // check floor with floor of user
    await this.floorsService.checkFloorWithFloorUser(user, getZonesDto.floorId);

    if (device.floor.id !== getZonesDto.floorId) {
      throw new HttpException(
        'FLOOR_NOT_MATCH_FLOOR_OF_DEVICE',
        HttpStatus.BAD_REQUEST,
      );
    }

    const page = getZonesDto.page ? getZonesDto.page : 1;
    const limit = getZonesDto.limit ? getZonesDto.limit : 10;
    const sortType = getZonesDto.sortType;
    const sortBy = getZonesDto.sortBy ? getZonesDto.sortBy : '';
    const keyword = getZonesDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    let where = {};

    if (getZonesDto.keyword) {
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

    where = {
      ...where,
      floor: { id: getZonesDto.floorId },
    };

    let [zones, total] = await this.zonesRepository.findAndCount(
      where,
      LIST_ZONE_RELATION,
      LIST_ZONE_SELECT,
      limit,
      skip,
      order,
    );

    // check zone have already existed
    // assign flag = true if zone asssign by gateway
    zones.map((itemZone: any) => {
      if (itemZone.gatewayManageArea.length > 0) {
        itemZone['isAssign'] = true;
        if (itemZone.gatewayManageArea[0].deviceId === gatewayId) {
          itemZone['isAvailable'] = true;
        } else {
          itemZone['isAvailable'] = false;
        }
        delete itemZone.gatewayManageArea;
      } else {
        itemZone['isAssign'] = false;
        itemZone['isAvailable'] = true;
        delete itemZone.gatewayManageArea;
      }
    });

    const result = this.paginationService.pagination(zones, total, page, limit);

    return result;
  }
}
