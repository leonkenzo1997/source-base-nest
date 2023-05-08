import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable
} from '@nestjs/common';
import { In, Like } from 'typeorm';
import { BaseService } from '../../base/base.service';
import { IPagination } from '../../interfaces/pagination.interface';
import { IReqUser } from '../../interfaces/request.interface';
import { PaginationService } from '../../utils/pagination.service';
import { IJwt } from '../authentication/interfaces/jwt.interface';
import { DeviceSettingService } from '../device-setting/device-setting.service';
import { UpdateIndicatorModeDto } from '../device-setting/dto/body-device-setting.dto';
import { DevicesService } from '../devices/devices.service';
import { IFloor } from '../floors/interfaces/floor.interface';
import { UserRole } from '../users/user.const';
import { UsersService } from '../users/users.service';
import { IZone } from '../zones/interfaces/zone.interface';
import { ZonesService } from '../zones/zones.service';
import { DeviceType } from './../device-types/device-types.const';
import { IDevice } from './../devices/interfaces/device.interface';
import { CreateGroupsDto } from './dto/create-group.dto';
import {
  GetListGroupByZoneArrayDto,
  GetListGroupsDto
} from './dto/get-groups.dto';
import { UpdateButtonPositionDto } from './dto/update-button-position.dto';
import {
  UpdateGroupLightOptimizationModeDto,
  UpdateGroupsDto,
  UpdateGroupSensorSettingDto,
  UpdateGroupSettingDto
} from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { GROUP_RELATION, GROUP_SELECT } from './groups.const';
import { IGroup } from './interfaces/group.interface';
import { DeleteGroupsRepository } from './repositories/delete-group.repository';
import { GroupsSettingRepository } from './repositories/groups-setting.repository';
import { GroupsRepository } from './repositories/groups.repository';

@Injectable()
export class GroupsService extends BaseService<Group, GroupsRepository> {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly deleteGroupsRepository: DeleteGroupsRepository,
    private readonly groupsSettingRepository: GroupsSettingRepository,
    private paginationService: PaginationService,
    @Inject(forwardRef(() =>  ZonesService))
    private readonly zonesService: ZonesService,
    private usersService: UsersService,
    @Inject(forwardRef(() => DeviceSettingService))
    private deviceSettingService: DeviceSettingService,
    @Inject(forwardRef(() => DevicesService))
    private devicesService: DevicesService,
  ) {
    super(groupsRepository);
  }

  /**
   * This function is create new group
   *
   * @param user IReqUser
   * @param createGroupsDto CreateGroupsDto
   * @returns IGroup
   */
  async createGroups(
    user: IReqUser,
    createGroupsDto: CreateGroupsDto,
  ): Promise<IGroup> {
    const zone: IZone = await this.zonesService.findById(createGroupsDto.zone);

    // check group register
    if (!zone) {
      throw new HttpException('ZONE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // check  quantity of groups in zone
    if (zone.groups.length >= 5) {
      throw new BadRequestException('LIMIT_GROUP_OF_ZONE');
    }

    // check floor of user with floor of group want to update
    await this.checkFloorOfZoneWithFloorOfUser(user, zone);

    let checkName = await this.groupsRepository.findOne({
      name: createGroupsDto.name,
      zone: {
        id: zone.id,
      },
      floorId: zone.floor.id,
      buildingId: zone.buildingId,
    });

    if (checkName) {
      throw new HttpException('NAME_GROUP_REGISTERED', HttpStatus.BAD_REQUEST);
    }

    // check protocolGroupId create
    const deleteGroup = await this.deleteGroupsRepository.findOne(
      {
        zone: { id: zone.id },
      },
      null,
      null,
      { protocolGroupId: 'ASC' },
    );

    let result: IGroup;

    let groupCreate: any = {
      ...createGroupsDto,
      zone: { id: zone.id },
      floorId: zone.floor.id,
      buildingId: zone.buildingId,
    };

    if (deleteGroup) {
      groupCreate = {
        ...groupCreate,
        protocolGroupId: deleteGroup.protocolGroupId,
      };

      result = await this.groupsRepository.create(groupCreate);

      await this.deleteGroupsRepository.softRemove(deleteGroup.id);
    } else {
      groupCreate = {
        ...groupCreate,
        protocolGroupId: zone.groups.length + 1,
      };

      result = await this.groupsRepository.create(groupCreate);
    }
    return result;
  }

  /**
   * This function is get list group of zone
   *
   * @param id number
   * @param user IJwt
   * @param getListGroupsDto GetListGroupsDto
   * @returns IPagination
   */
  async getList(
    id: number,
    user: IJwt,
    getListGroupsDto: GetListGroupsDto,
  ): Promise<IPagination> {
    const zone = await this.zonesService.findById(id);

    if (!zone) {
      throw new HttpException('ZONE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // check zone assign user login (user and admin account)
    if (user.roleId === UserRole.Admin || user.roleId === UserRole.User) {
      //check floor of zone with floor of user
      await this.checkFloorOfZoneWithFloorOfUser(user, zone);
    }

    const page = getListGroupsDto.page ? getListGroupsDto.page : 1;
    const limit = getListGroupsDto.limit ? getListGroupsDto.limit : 10;
    const sortType = getListGroupsDto.sortType;
    const sortBy = getListGroupsDto.sortBy ? getListGroupsDto.sortBy : '';
    const keyword = getListGroupsDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    let where = {};

    if (getListGroupsDto.keyword) {
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
      zone: { id: id },
    };
    const [groups, total] = await this.groupsRepository.findAndCount(
      where,
      null,
      null,
      limit,
      skip,
      order,
    );

    const result = this.paginationService.pagination(
      groups,
      total,
      page,
      limit,
    );
    return result;
  }

  /**
   * This function is get list group of zone
   *
   * @param user IJwt
   * @param getListGroupByZoneArrayDto GetListGroupByZoneArrayDto
   * @returns IPagination
   */
  async getListGroupByZoneArray(
    user: IJwt,
    getListGroupByZoneArrayDto: GetListGroupByZoneArrayDto,
  ): Promise<IPagination> {
    const page = getListGroupByZoneArrayDto.page
      ? getListGroupByZoneArrayDto.page
      : 1;
    const limit = getListGroupByZoneArrayDto.limit
      ? getListGroupByZoneArrayDto.limit
      : 10;
    const sortType = getListGroupByZoneArrayDto.sortType;
    const sortBy = getListGroupByZoneArrayDto.sortBy
      ? getListGroupByZoneArrayDto.sortBy
      : '';
    const keyword = getListGroupByZoneArrayDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    let where = {};

    if (getListGroupByZoneArrayDto.keyword) {
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
      zone: { id: In(getListGroupByZoneArrayDto.zone) },
    };

    const [groups, total] = await this.groupsRepository.findAndCount(
      where,
      null,
      null,
      limit,
      skip,
      order,
    );

    const result = this.paginationService.pagination(
      groups,
      total,
      page,
      limit,
    );
    return result;
  }

  /**
   * This function is update groups
   *
   * @param user IJwt
   * @param id number
   * @param updateGroupsDto UpdateGroupsDto
   * @returns IGroup
   */
  async updateGroup(
    user: IJwt,
    id: number,
    updateGroupsDto: UpdateGroupsDto,
  ): Promise<IGroup> {
    const group = await this.findById(id);

    // check group register
    if (!group) {
      throw new HttpException('GROUP_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // check floor of user with floor of group want to update
    await this.checkFloorOfGroupWithFloorOfUser(user, group);

    let checkName = await this.groupsRepository.findOne({
      name: updateGroupsDto.name,
      zone: {
        id: group.zone.id,
      },
      floorId: group.floorId,
      buildingId: group.buildingId,
    });

    if (checkName) {
      throw new HttpException('NAME_GROUP_REGISTERED', HttpStatus.BAD_REQUEST);
    }

    let newDataGroup = await this.groupsRepository.updateOneAndReturnById(
      id,
      updateGroupsDto,
    );
    return newDataGroup;
  }

  /**
   * This method delete group by id and user login
   *
   * @param user IReqUser
   * @param id number
   * @returns void
   */
  public async deleteGroup(user: IJwt, id: number): Promise<void> {
    const group = await this.findById(id);

    // check zone register
    if (!group) {
      throw new HttpException('GROUP_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (group.devices.length > 0) {
      throw new HttpException('DEVICE_EXIST_IN_GROUP', HttpStatus.BAD_REQUEST);
    }

    // check floor of user with floor of group want to update
    await this.checkFloorOfGroupWithFloorOfUser(user, group);

    await this.deleteGroupsRepository.create({
      protocolGroupId: group.protocolGroupId,
      zone: { id: group.zone.id },
    });

    await this.groupsRepository.softRemove(id, {
      sceneSettingArea: true,
      groupSetting: true,
    });
  }

  /**
   * This function is get detail group
   *
   * @param id number
   * @returns IGroup
   */
  async getDetail(id: number): Promise<IGroup> {
    let group = await this.findById(id);

    if (!group) {
      throw new HttpException('GROUP_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    let device: IDevice;

    if (group.devices) {
      group.devices.map((data: IDevice) => {
        if (data.deviceTypeId === DeviceType.SmartSensor) {
          device = data;
        }
      });
    }

    let masterSensor = await this.devicesService.findOne({
      masterSensor: true,
      group: { id: group.id },
    });
    group = {
      ...group,
      masterSensor: masterSensor ? masterSensor : null,
    };

    return group;
  }

  /**
   * This function is find By id of floors
   *
   * @param id number
   * @returns IGroup
   */
  public async findById(id: number): Promise<IGroup> {
    const where = { id };

    let groups: IGroup = await this.groupsRepository.findOne(
      where,
      GROUP_RELATION,
      {
        ...GROUP_SELECT,
        zone: { id: true, name: true, protocolZoneId: true },
      },
    );

    return groups;
  }

  /**
   * This function  check floor of group with floor of user
   *
   * @param user IJwt
   * @param zone IZone
   * @return void
   */
  public async checkFloorOfZoneWithFloorOfUser(
    user: IJwt,
    zone: IZone,
  ): Promise<void> {
    let userData = await this.usersService.findById(user.userId);

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
   * This function check floor of group with floor of user
   *
   * @param user IJwt
   * @param group IGroup
   * @return IFloor
   */
  public async checkFloorOfGroupWithFloorOfUser(
    user: IJwt,
    group: IGroup,
  ): Promise<IFloor> {
    let userData = await this.usersService.findById(user.userId);

    // check floorId of user === floorId of zone
    let checkFloor: number = 0;
    let result: IFloor;

    for (let floor of userData.floors) {
      if (floor.id === group.floorId) {
        checkFloor = 1;
        result = floor;
        break;
      }
    }

    if (checkFloor != 1) {
      throw new HttpException(
        'ZONE_FLOOR_NOT_MATCH_USER_FLOOR',
        HttpStatus.BAD_REQUEST,
      );
    }

    return result;
  }

  /**
   * This method check group with group of zone
   *
   * @param groupId number
   * @param zoneData IZone
   * @returns void
   */
  public async checkGroupOfZone(
    groupId: number,
    zoneData: IZone,
  ): Promise<void> {
    // check group with group of zone
    let checkGroupOfZone = zoneData.groups.some(
      (group: any) => group.id === groupId,
    );

    if (!checkGroupOfZone) {
      throw new HttpException(
        'GROUP_NOT_MATCH_GROUP_OF_ZONE',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * This function to get and check data of group
   *
   * @param zoneData IZone
   * @param groupId number
   * @returns IGroup
   */
  async getAndCheckGroup(zoneData: IZone, groupId: number): Promise<IGroup> {
    //check group exist
    let groupData: IGroup = await this.getDetail(groupId);

    // check group with group of zone
    await this.checkGroupOfZone(groupData.id, zoneData);

    return groupData;
  }

  /**
   * This function change position of group
   *
   * @param id number
   * @param updateButtonPositionDto UpdateButtonPositionDto
   * @param user IJwt
   * @returns IGroup
   */
  public async updateButtonPosition(
    id: number,
    updateButtonPositionDto: UpdateButtonPositionDto,
    user: IJwt,
  ): Promise<IGroup> {
    const group = await this.findById(id);

    // check group register
    if (!group) {
      throw new HttpException('GROUP_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // check floor of user with floor of group want to update
    const floor = await this.checkFloorOfGroupWithFloorOfUser(user, group);

    const groupPosition = await this.groupsRepository.findOne({
      buttonPosition: String(updateButtonPositionDto.buttonPosition),
      floorId: floor.id,
    });

    if (groupPosition) {
      const result = await this.groupsRepository.updateOneAndReturnById(id, {
        buttonPosition: String(updateButtonPositionDto.buttonPosition),
      });

      await this.groupsRepository.updateOneById(groupPosition.id, {
        buttonPosition: '0',
      });
    }

    if (
      group.buttonPosition != '0' &&
      updateButtonPositionDto.buttonPosition != 0
    ) {
      throw new BadRequestException('GROUP_REGISTER_IN_POSITION');
    }

    const result = await this.groupsRepository.updateOneAndReturnById(id, {
      buttonPosition: String(updateButtonPositionDto.buttonPosition),
    });

    return result;
  }

  /**
   * This function to update setting of device
   *
   * @param groupId number
   * @param data UpdateDeviceSettingDto
   * @returns IDevice
   */
  async updateGroupSetting(
    groupId: number,
    data: UpdateGroupSettingDto,
    user: IJwt,
  ): Promise<any> {
    let dataUpdate = {
      id: groupId,
      groupSetting: data,
    };

    let group = await this.findById(groupId);

    // check group register
    if (!group) {
      throw new HttpException('GROUP_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // check floor of user with floor of group want to update
    const floor = await this.checkFloorOfGroupWithFloorOfUser(user, group);

    // check group setting

    if (group.groupSetting) {
      await this.groupsSettingRepository.updateOneAndReturnById(
        group.groupSetting.id,
        data,
      );
    } else {
      await this.groupsRepository.create(dataUpdate);
    }

    for (let device of group.devices) {
      if (device.deviceTypeId === DeviceType.LightBulb) {
        if (!device.deviceSetting) {
          let deviceId = device.id;
          let dataDeviceSetting = data;

          await this.devicesService.updateDeviceSetting(
            deviceId,
            dataDeviceSetting,
          );
        } else {
          await this.deviceSettingService.updateSetting(device.id, data);
        }
      }
    }

    group = await this.findById(groupId);

    return group;
  }

  /**
   * This function is update sensor setting of group

   * @param groupId number
   * @param data UpdateGroupSensorSettingDto
   * @param user IJwt
   * @returns IGroup
   */
  public async updateGroupSettingSensor(
    groupId: number,
    data: UpdateGroupSensorSettingDto,
    user: IJwt,
  ): Promise<IGroup> {
    let group = await this.findById(groupId);

    // check group register
    if (!group) {
      throw new HttpException('GROUP_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // check floor of user with floor of group want to update
    const floor = await this.checkFloorOfGroupWithFloorOfUser(user, group);

    // check group setting

    if (group.groupSetting) {
      await this.groupsSettingRepository.updateOneAndReturnById(
        group.groupSetting.id,
        data,
      );
    } else {
      let dataUpdate = {
        id: groupId,
        groupSetting: data,
      };
      await this.groupsRepository.create(dataUpdate);
    }

    if (group.devices) {
      for (let device of group.devices) {
        if (device.deviceTypeId === DeviceType.SmartSensor) {
          if (!device.deviceSetting) {
            let sensorSetting = await this.deviceSettingService.create(data);

            await this.devicesService.updateOneById(device.id, {
              deviceSetting: { id: sensorSetting.id },
            });
          } else {
            await this.deviceSettingService.updateOneById(
              device.deviceSetting.id,
              data,
            );
          }
        }
      }
    }

    group = await this.findById(groupId);

    return group;
  }

  /**
   * This function is update light optimization sensor on group and set master sensor

   * @param user IJwt
   * @param groupId number
   * @param data UpdateGroupLightOptimizationModeDto
   * @returns 
   */
  public async updateLightOptimizationMode(
    user: IJwt,
    groupId: number,
    data: UpdateGroupLightOptimizationModeDto,
  ): Promise<IGroup> {
    let group = await this.findById(groupId);

    // check group register
    if (!group) {
      throw new HttpException('GROUP_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // check floor of user with floor of group want to update
    const floor = await this.checkFloorOfGroupWithFloorOfUser(user, group);
    const listSensor = await this.devicesService.find({
      group: { id: groupId },
      deviceType: { id: DeviceType.SmartSensor },
    });

    let device: IDevice;
    if (data.masterSensor.length === 1) {
      device = await this.devicesService.findOne({
        id: data.masterSensor[0].deviceId,
      });

      // check device registration
      if (!device) {
        throw new HttpException('DEVICES_NOT_FOUND', HttpStatus.NOT_FOUND);
      }

      // check device type smart sensor
      if (device.deviceTypeId != DeviceType.SmartSensor) {
        throw new HttpException(
          'DEVICE_NOT_SMART_SENSOR',
          HttpStatus.BAD_REQUEST,
        );
      }
      // check device registration at option single
      if (device.option != 'single') {
        throw new HttpException(
          'SMART_SENSOR_NOT_SINGLE',
          HttpStatus.FORBIDDEN,
        );
      }
    }

    // check group setting

    if (group.groupSetting) {
      await this.groupsSettingRepository.updateOneAndReturnById(
        group.groupSetting.id,
        data.optimization,
      );
    } else {
      let dataUpdate = {
        id: groupId,
        groupSetting: data.optimization,
      };
      await this.groupsRepository.create(dataUpdate);
    }

    for (let sensor of listSensor) {
      if (sensor.deviceSetting) {
        await this.deviceSettingService.updateOneById(
          sensor.deviceSetting.id,
          data.optimization,
        );
        await this.devicesService.updateOneById(sensor.id, {
          masterSensor: false,
        });
      } else {
        let sensorSetting = await this.deviceSettingService.create(
          data.optimization,
        );

        await this.devicesService.updateOneById(sensor.id, {
          deviceSetting: { id: sensorSetting.id },
          masterSensor: false,
        });
      }

      if (device?.id === sensor.id) {
        await this.devicesService.updateOneById(device.id, {
          masterSensor: true,
        });
      }
    }

    group = await this.findById(groupId);

    return group;
  }

  /**
   * This function is update indicator mode sensor for group

   * @param user IJwt
   * @param groupId number
   * @param updateIndicatorModeDto UpdateIndicatorModeDto
   * @returns IGroup
   */
  public async updateGroupIndicatorMode(
    user: IJwt,
    groupId: number,
    updateIndicatorModeDto: UpdateIndicatorModeDto,
  ): Promise<IGroup> {
    let group = await this.findById(groupId);

    // check group register
    if (!group) {
      throw new HttpException('GROUP_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // check floor of user with floor of group want to update
    const floor = await this.checkFloorOfGroupWithFloorOfUser(user, group);
    const listSensor = await this.devicesService.find({
      group: { id: groupId },
      deviceType: { id: DeviceType.SmartSensor },
    });

    // check group setting

    if (group.groupSetting) {
      await this.groupsSettingRepository.updateOneAndReturnById(
        group.groupSetting.id,
        updateIndicatorModeDto,
      );
    } else {
      let dataUpdate = {
        id: groupId,
        groupSetting: updateIndicatorModeDto,
      };
      await this.groupsRepository.create(dataUpdate);
    }

    for (let sensor of listSensor) {
      if (!sensor.deviceSetting) {
        let dataUpdate = {
          id: sensor.id,
          deviceSetting: updateIndicatorModeDto,
        };
        let dataDevice = await this.devicesService.create(dataUpdate);
      } else {
        let deviceSettingId = sensor.deviceSetting.id;

        await this.deviceSettingService.updateOneById(
          deviceSettingId,
          updateIndicatorModeDto,
        );
      }
    }

    group = await this.findById(groupId);

    return group;
  }
}
