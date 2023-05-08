import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { In, Like, MoreThan } from 'typeorm';
import { IPagination } from '../../interfaces/pagination.interface';
import { PaginationService } from '../../utils/pagination.service';
import { IJwt } from '../authentication/interfaces/jwt.interface';
import { UpdateDeviceSettingDto } from '../device-setting/dto/update-device-setting.dto';
import { DeviceType } from '../device-types/device-types.const';
import { FloorsService } from '../floors/floors.service';
import { IFloor } from '../floors/interfaces/floor.interface';
import { GroupsService } from '../groups/groups.service';
import { IGroup } from '../groups/interfaces/group.interface';
import { IZone } from '../zones/interfaces/zone.interface';
import { ZonesService } from '../zones/zones.service';
import { DeviceSettingService } from './../device-setting/device-setting.service';
import {
  DEVICE_RELATION,
  DEVICE_SELECT,
  LIMIT_DEVICE_GROUP,
  OPTION_SENSOR,
  SortTypeDevice,
} from './devices.const';
import { DeleteListDeviceDto } from './dto/ delete-device.dto';

import { AssignAreaForGatewayDto } from './dto/assign-area-for-gateway.dto';
import {
  ChangeAreaDeviceAssignDto,
  ChangeAreaSensorAssignDto,
} from './dto/change-group.dto';
import {
  CreateDeviceDto,
  CreateDeviceSensorDto,
} from './dto/create-device.dto';
import {
  GetListDeviceByGatewayDto,
  GetListDeviceDto,
  GetListDeviceForAdminDto,
  GetListGateWayDeviceDto,
  GetListSensorSingleDto,
} from './dto/get-list-device.dto';
import { ChangeNameDeviceDto } from './dto/update-device.dto';
import { DevicesEntity } from './entities/device.entity';
import { IDeleteDevice } from './interfaces/delete-device.interface';
import { IDevice } from './interfaces/device.interface';
import { DeleteDevicesRepository } from './repositories/delete-device.repository';
import { DevicesRepository } from './repositories/devices.repository';
import { GatewayManageAreaRepository } from './repositories/gateway-manage-area.repository';

@Injectable()
export class DevicesService extends BaseService<
  DevicesEntity,
  DevicesRepository
> {
  constructor(
    private readonly devicesRepository: DevicesRepository,
    private readonly deleteDevicesRepository: DeleteDevicesRepository,
    private readonly gatewayManageAreaRepository: GatewayManageAreaRepository,
    private readonly floorsService: FloorsService,
    @Inject(forwardRef(() => ZonesService))
    private readonly zonesService: ZonesService,
    private paginationService: PaginationService,
    @Inject(forwardRef(() => GroupsService))
    private readonly groupsService: GroupsService,
    @Inject(forwardRef(() => DeviceSettingService))
    private readonly deviceSettingService: DeviceSettingService,
  ) {
    super(devicesRepository);
  }

  /**
   * This function create array device
   *
   * @param user IJwt
   * @param createDeviceDto CreateDeviceDto
   * @returns IDevice
   */
  async createDevice(
    user: IJwt,
    createDeviceDto: CreateDeviceDto,
  ): Promise<IDevice[]> {
    const listDevice: any[] = createDeviceDto.listDevice;

    let result: IDevice[] = [];

    for (let i = 0; i < listDevice.length; i++) {
      const deviceTypeId = listDevice[i].deviceType;
      // if device have type smart sensor, we check address name later.
      // because one device smart sensor can assign two group
      if (deviceTypeId !== DeviceType.SmartSensor) {
        //check device register
        let checkRegister: IDevice;
        switch (deviceTypeId) {
          case DeviceType.GateWay:
            checkRegister = await this.devicesRepository.findOne({
              address: listDevice[i].address,
              floorId: listDevice[i].floorId,
            });
            break;
          case DeviceType.LightBulb:
            checkRegister = await this.devicesRepository.findOne({
              address: listDevice[i].address,
              groupId: listDevice[i].groupId,
            });
            break;
        }

        if (checkRegister) {
          throw new HttpException('DEVICE_REGISTER', HttpStatus.BAD_REQUEST);
        }
        await this.checkAddressDevice(listDevice[i].address);
      }

      //check floor exist and check floor with floor of user
      const floorData: IFloor = await this.floorsService.getAndCheckFloor(
        user,
        listDevice[i].floorId,
      );

      let zoneData: IZone;
      let groupData: IGroup;

      if (listDevice[i].zoneId) {
        //check zone exist and check zone with zone of floor
        zoneData = await this.zonesService.getAndCheckZone(
          floorData,
          listDevice[i].zoneId,
        );
      }

      if (listDevice[i].groupId) {
        //check group exist and check group with group of zone
        groupData = await this.groupsService.getAndCheckGroup(
          zoneData,
          listDevice[i].groupId,
        );
      }

      delete listDevice[i].groupId;
      delete listDevice[i].floorId;
      delete listDevice[i].zoneId;
      delete listDevice[i].deviceType;

      let data = {
        ...listDevice[i],
        floor: {
          id: floorData.id,
        },
        building: { id: floorData.building.id },
        deviceType: { id: deviceTypeId },
        timeActive: new Date(),
      };

      let deleteDevice: IDeleteDevice;

      let whereDeleteDevice: any = {
        floor: {
          id: floorData.id,
        },
      };

      let device: IDevice;
      switch (deviceTypeId) {
        case DeviceType.GateWay:
          delete data.typeLightBulb;
          whereDeleteDevice = {
            ...whereDeleteDevice,
            deviceType: { id: DeviceType.GateWay },
          };

          // check floor have existed device gateway
          // let deviceGateway = await this.devicesRepository.findOne({
          //   deviceTypeId: DeviceType.GateWay,
          //   floorId: floorData.id,
          // });

          // one floor only one device gateway
          // if (deviceGateway) {
          //   throw new HttpException(
          //     'LIMIT_DEVICE_GATEWAY_OF_FLOOR',
          //     HttpStatus.BAD_REQUEST,
          //   );
          // }

          deleteDevice = await this.deleteDevicesRepository.findOne(
            whereDeleteDevice,
            null,
            null,
            { protocolDeviceId: 'ASC' },
          );

          // check device had already deleted. if true, we create again
          if (deleteDevice) {
            data = {
              ...data,
              protocolDeviceId: deleteDevice.protocolDeviceId,
            };
          } else {
            let quantityDeviceGateway = await this.devicesRepository.find({
              deviceType: { id: DeviceType.GateWay },
              floor: {
                id: floorData.id,
              },
            });

            data = {
              ...data,
              protocolDeviceId: quantityDeviceGateway.length + 1,
            };
          }

          // create device
          device = await this.devicesRepository.create(data);

          //delete data delete of device (delete-device table)
          if (deleteDevice) {
            await this.deleteDevicesRepository.softRemove(deleteDevice.id);
          }

          result.push(device);

          break;
        case DeviceType.SmartSwitch:
          delete data.typeLightBulb;
          data = {
            ...data,
            zone: { id: zoneData.id },
          };

          let deviceSmartSwitch = await this.devicesRepository.findOne({
            deviceTypeId: DeviceType.SmartSwitch,
            floorId: floorData.id,
            zoneId: zoneData.id,
          });

          // one zone only one device smart switch
          if (deviceSmartSwitch) {
            throw new HttpException(
              'LIMIT_DEVICE_SMART_SWITCH_OF_ZONE',
              HttpStatus.BAD_REQUEST,
            );
          }

          // create device
          device = await this.devicesRepository.create(data);
          zoneData.devices.push(device);

          //delete data delete of device (delete-device table)
          if (deleteDevice) {
            await this.deleteDevicesRepository.softRemove(deleteDevice.id);
          }

          result.push(device);
          break;
        // case DeviceType.SmartSensor:
        //   if (deviceTypeId === DeviceType.SmartSensor) {
        //     let deviceSmartSensor = await this.devicesRepository.find({
        //       floorId: floorData.id,
        //       zoneId: zoneData.id,
        //       deviceTypeId: DeviceType.SmartSensor,
        //     });

        //     if (deviceSmartSensor.length >= 2) {
        //       throw new HttpException(
        //         'LIMIT_GROUP_OF_DEVICE_SMART_SENSOR',
        //         HttpStatus.BAD_REQUEST,
        //       );
        //     } else {
        //       if (deviceSmartSensor.length > 0) {
        //         if (deviceSmartSensor[0].groupId === groupData.id) {
        //           throw new HttpException(
        //             'DEVICE_SMART_SENSOR_REGISTER_IN_GROUP',
        //             HttpStatus.BAD_REQUEST,
        //           );
        //         }
        //       }
        //     }
        //   }

        case DeviceType.LightBulb:
          if (groupData.devices.length >= LIMIT_DEVICE_GROUP) {
            throw new HttpException(
              'LIMIT_DEVICE_OF_GROUP',
              HttpStatus.BAD_REQUEST,
            );
          }

          whereDeleteDevice = {
            ...whereDeleteDevice,
            group: {
              id: groupData.id,
            },
            zone: {
              id: zoneData.id,
            },
          };

          deleteDevice = await this.deleteDevicesRepository.findOne(
            whereDeleteDevice,
            null,
            null,
            { protocolDeviceId: 'ASC' },
          );

          // check device had already deleted. if true, we create again
          if (deleteDevice) {
            data = {
              ...data,
              zone: { id: zoneData.id },
              group: { id: groupData.id },
              protocolDeviceId: deleteDevice.protocolDeviceId,
            };
          } else {
            // case create smart sensor first, we must assign protocol device id equal one first
            let checkProtocolDeviceIdEqualOne =
              await this.devicesRepository.findOne({
                groupId: groupData.id,
                protocolDeviceId: 1,
              });

            // check protocol Device id is equal one, if we don't have, we assign protocol device id equal one
            if (!checkProtocolDeviceIdEqualOne) {
              data = {
                ...data,
                zone: { id: zoneData.id },
                group: { id: groupData.id },
                protocolDeviceId: 1,
              };
            } else {
              data = {
                ...data,
                zone: { id: zoneData.id },
                group: { id: groupData.id },
                protocolDeviceId: groupData.devices.length + 1,
              };
            }
          }

          // create device
          device = await this.devicesRepository.create(data);
          groupData.devices.push(device);

          //delete data delete of device (delete-device table)
          if (deleteDevice) {
            await this.deleteDevicesRepository.softRemove(deleteDevice.id);
          }

          result.push(device);
          break;
        default:
          data = {
            ...data,
            zone: { id: zoneData.id },
            group: { id: groupData.id },
            protocolDeviceId: groupData.devices.length + 1,
          };

          // create device
          device = await this.devicesRepository.create(data);

          groupData.devices.push(device);

          //delete data delete of device (delete-device table)
          if (deleteDevice) {
            await this.deleteDevicesRepository.softRemove(deleteDevice.id);
          }

          result.push(device);
          break;
      }
    }

    return result;
  }

  /**
   * This function to get detail of device
   *
   * @param id number
   * @returns IDevice
   */
  async getDetailDevice(id: number): Promise<IDevice> {
    let device: IDevice = await this.findById(id);

    if (!device) {
      throw new HttpException('DEVICES_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    delete device.floorId;
    delete device.groupId;
    delete device.zoneId;

    return device;
  }

  /**
   * This function to get detail of device
   *
   * @param address string
   * @returns IDevice
   */
  async getDetailDeviceByAddress(address: string): Promise<IDevice> {
    const where = { address: address };

    let device = await this.devicesRepository.find(
      where,
      DEVICE_RELATION,
      DEVICE_SELECT,
    );

    let data = null;

    if (device.length == 2) {
      device[0]['secondGroup'] = device[1].group;
      device[0]['secondGroupId'] = device[1].groupId;
      device[0]['secondPositionGroup'] = device[1].positionGroup;
    }

    if (device.length > 0) {
      data = device[0];
    }

    return data;
  }

  /**
   * This function to find one device via id of device
   *
   * @param id number
   * @returns IDevice
   */
  async findById(id: number): Promise<IDevice> {
    const where = { id };

    const device = await this.devicesRepository.findOne(
      where,
      DEVICE_RELATION,
      DEVICE_SELECT,
    );

    return device;
  }

  /**
   * This function to check name of device
   *
   * @param address string
   * @returns void
   */
  async checkAddressDevice(address: string): Promise<void> {
    const dataDevice = await this.devicesRepository.findOne({
      address: address,
    });

    if (dataDevice) {
      throw new HttpException(
        'DEVICE_REGISTER_ANOTHER',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * This function to check address of device
   *
   * @param name string
   * @returns void
   */
  async checkNameDevice(name: string): Promise<void> {
    const dataDevice = await this.devicesRepository.findOne({
      name: name,
    });

    if (dataDevice) {
      throw new HttpException('DEVICE_REGISTER', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * This function to get list device
   *
   * @param user IJwt
   * @param getListDeviceDto GetListDeviceDto
   * @returns IPagination
   */
  public async getListDevice(
    user: IJwt,
    getListDeviceDto: GetListDeviceDto,
  ): Promise<IPagination> {
    const page = getListDeviceDto.page ? getListDeviceDto.page : 1;
    const limit = getListDeviceDto.limit ? getListDeviceDto.limit : 10;
    const sortType = getListDeviceDto.sortType;
    const sortBy = getListDeviceDto.sortBy ? getListDeviceDto.sortBy : '';
    const keyword = getListDeviceDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    let where = {};

    if (getListDeviceDto.keyword) {
      where = { ...where, name: Like(`%${keyword}%`) };
    }

    //check floor exist and check floor with floor of user
    const floorData: IFloor = await this.floorsService.getAndCheckFloor(
      user,
      getListDeviceDto.floorId,
    );

    //check zone exist and check zone with zone of floor
    const zoneData = await this.zonesService.getAndCheckZone(
      floorData,
      getListDeviceDto.zoneId,
    );

    //check group exist
    const groupData = await this.groupsService.getAndCheckGroup(
      zoneData,
      getListDeviceDto.groupId,
    );

    // handle condition to find
    where = {
      ...where,
      floor: { id: floorData.id },
      zone: { id: zoneData.id },
      group: { id: groupData.id },
      deviceType: {
        id: In([DeviceType.SmartSensor, DeviceType.LightBulb]),
      },
    };

    if (sortBy) {
      order = {
        [sortBy]: sortType,
      };
    } else {
      order = {
        id: sortType,
      };
    }

    const [devices, total] = await this.devicesRepository.findAndCount(
      where,
      DEVICE_RELATION,
      DEVICE_SELECT,
      limit,
      skip,
      order,
    );

    const result = this.paginationService.pagination(
      devices,
      total,
      page,
      limit,
    );

    return result;
  }

  /**
   * This function to get list device
   *
   * @param user IJwt
   * @param getListGateWayDeviceDto GetListGateWayDeviceDto
   * @returns IPagination
   */
  public async getListGateWayDevice(
    user: IJwt,
    getListGateWayDeviceDto: GetListGateWayDeviceDto,
  ): Promise<IPagination> {
    const page = getListGateWayDeviceDto.page
      ? getListGateWayDeviceDto.page
      : 1;
    const limit = getListGateWayDeviceDto.limit
      ? getListGateWayDeviceDto.limit
      : 10;
    const sortType = getListGateWayDeviceDto.sortType;
    const sortBy = getListGateWayDeviceDto.sortBy
      ? getListGateWayDeviceDto.sortBy
      : '';
    const keyword = getListGateWayDeviceDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    let where = {};

    if (getListGateWayDeviceDto.keyword) {
      where = { ...where, name: Like(`%${keyword}%`) };
    }

    //check floor exist and check floor with floor of user
    const floorData: IFloor = await this.floorsService.getAndCheckFloor(
      user,
      getListGateWayDeviceDto.floorId,
    );

    // handle condition to find
    where = {
      ...where,
      floor: { id: floorData.id },
      deviceType: {
        id: In([DeviceType.GateWay]),
      },
    };

    if (sortBy) {
      order = {
        [sortBy]: sortType,
      };
    } else {
      order = {
        id: sortType,
      };
    }

    const [devices, total] = await this.devicesRepository.findAndCount(
      where,
      DEVICE_RELATION,
      DEVICE_SELECT,
      limit,
      skip,
      order,
    );

    const result = this.paginationService.pagination(
      devices,
      total,
      page,
      limit,
    );

    return result;
  }

  /**
   * This function to get list device
   *
   * @param user
   * @param getListDeviceForAdminDto GetListDeviceForAdminDto
   * @returns IPagination
   */
  public async getListDeviceForAdmin(
    user: IJwt,
    getListDeviceForAdminDto: GetListDeviceForAdminDto,
  ): Promise<IPagination> {
    const page = getListDeviceForAdminDto.page
      ? getListDeviceForAdminDto.page
      : 1;
    const limit = getListDeviceForAdminDto.limit
      ? getListDeviceForAdminDto.limit
      : 10;
    const sortType = getListDeviceForAdminDto.sortType;
    const sortBy = getListDeviceForAdminDto.sortBy
      ? getListDeviceForAdminDto.sortBy
      : '';
    const keyword = getListDeviceForAdminDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    let where = {};

    if (getListDeviceForAdminDto.keyword) {
      where = { ...where, name: Like(`%${keyword}%`) };
    }

    //check floor exist and check floor with floor of user
    const floorData: IFloor = await this.floorsService.getAndCheckFloor(
      user,
      getListDeviceForAdminDto.floorId,
    );

    where = {
      ...where,
      floorId: floorData.id,
    };

    const whereArray: any[] = [];

    await Promise.all(
      getListDeviceForAdminDto.deviceType.map(async (item: any) => {
        switch (parseInt(item)) {
          case DeviceType.GateWay:
            whereArray.push({
              ...where,
              deviceTypeId: In([DeviceType.GateWay]),
            });

            break;
          case DeviceType.SmartSwitch:
            if (
              !getListDeviceForAdminDto.zone ||
              getListDeviceForAdminDto.zone[0] == ''
            ) {
              whereArray.push({
                ...where,
                deviceTypeId: In([DeviceType.SmartSwitch]),
              });
            } else {
              whereArray.push({
                ...where,
                zoneId: In(getListDeviceForAdminDto.zone),
                deviceTypeId: In([DeviceType.SmartSwitch]),
              });
            }

            break;
          case DeviceType.SmartSensor:
            // check zone do not have value ex: [""]
            if (
              !getListDeviceForAdminDto.zone ||
              getListDeviceForAdminDto.zone[0] == ''
            ) {
              // find belong to floorId
              whereArray.push({
                ...where,
                deviceTypeId: In([DeviceType.SmartSensor]),
              });
            }
            // check zone have value
            else {
              //check group do not have value ex: [""]
              if (
                !getListDeviceForAdminDto.group ||
                getListDeviceForAdminDto.group[0] == ''
              ) {
                whereArray.push({
                  ...where,
                  zoneId: In(getListDeviceForAdminDto.zone),
                  deviceTypeId: In([DeviceType.SmartSensor]),
                });
              }
              // group have value
              else {
                // having all value include in floor, zone, group
                whereArray.push({
                  ...where,
                  zoneId: In(getListDeviceForAdminDto.zone),
                  groupId: In(getListDeviceForAdminDto.group),
                  deviceTypeId: In([DeviceType.SmartSensor]),
                });
              }
            }
            break;
          case DeviceType.LightBulb:
            // check zone do not have value ex: [""]
            if (
              !getListDeviceForAdminDto.zone ||
              getListDeviceForAdminDto.zone[0] == ''
            ) {
              whereArray.push({
                ...where,
                deviceTypeId: In([DeviceType.LightBulb]),
              });
            }
            // check zone have value ex: group[""]
            else {
              // check group do not have value ex
              if (
                !getListDeviceForAdminDto.group ||
                getListDeviceForAdminDto.group[0] == ''
              ) {
                whereArray.push({
                  ...where,
                  zoneId: In(getListDeviceForAdminDto.zone),
                  deviceTypeId: In([DeviceType.LightBulb]),
                });
              }
              // group have value
              else {
                // having all value include in floor, zone, group
                whereArray.push({
                  ...where,
                  zoneId: In(getListDeviceForAdminDto.zone),
                  groupId: In(getListDeviceForAdminDto.group),
                  deviceTypeId: In([DeviceType.LightBulb]),
                });
              }
            }

            break;
        }
      }),
    );

    if (sortBy) {
      switch (sortBy) {
        case SortTypeDevice.BUILDING:
        case SortTypeDevice.FLOOR:
        case SortTypeDevice.ZONE:
        case SortTypeDevice.GROUP:
          order = {
            [sortBy]: {
              name: sortType,
            },
          };
          break;
        case SortTypeDevice.DEVICE_TYPE:
          order = {
            [sortBy]: {
              type: sortType,
            },
          };
          break;
        default:
          order = {
            [sortBy]: sortType,
          };
          break;
      }
    } else {
      order = {
        id: sortType,
      };
    }

    const [devices, total] = await this.devicesRepository.findAndCount(
      whereArray,
      {
        building: true,
        floor: true,
        zone: true,
        group: true,
        deviceType: true,
        deviceSetting: true,
      },
      {
        building: { id: true, name: true },
        floor: { id: true, name: true },
        zone: { id: true, name: true },
        group: { id: true, name: true },
        deviceType: { id: true, type: true },
        deviceSetting: {
          id: true,
          brightness: true,
          tone: true,
          fadeOutTime: true,
          fadeInTime: true,
          sensorSensitivity: true,
          recognizingCycleTime: true,
          brightnessRetentionTime: true,
        },
      },
      limit,
      skip,
      order,
    );

    const result = this.paginationService.pagination(
      devices,
      total,
      page,
      limit,
    );
    return result;
  }

  /**
   * This function to check device smart switch registered in zone
   *
   * @param zoneId number
   * @returns any
   */
  async checkDeviceSmartSwitch(zoneId: number): Promise<any> {
    let device = await this.devicesRepository.findOne({
      deviceTypeId: DeviceType.SmartSwitch,
      zoneId: zoneId,
    });

    let dataDevice: any = {
      isRegistered: !!device,
      protocolDeviceId: device ? device.protocolDeviceId : null,
      smartSwitchId: device ? device.id : null,
    };

    return dataDevice;
  }

  /**
   * This function to delete array device via id
   *
   * @param deleteListDeviceDto DeleteListDeviceDto
   * @returns void
   */
  async deleteListDevice(
    deleteListDeviceDto: DeleteListDeviceDto,
  ): Promise<void> {
    const listDevice = deleteListDeviceDto.listDevice;

    await Promise.all(
      listDevice.map(async (item: any) => {
        let device = await this.getDetailDevice(item.id);

        let dataDelete: any = {
          protocolDeviceId: device.protocolDeviceId,
          floor: { id: device.floor.id },
        };

        switch (device.deviceType.id) {
          case DeviceType.LightBulb:
            dataDelete = {
              ...dataDelete,
              group: { id: device.group.id },
              zone: { id: device.zone.id },
              deviceType: {
                id: DeviceType.LightBulb,
              },
            };

            // adding data device that the user want to delete device in delete device table
            await this.deleteDevicesRepository.create(dataDelete);

            // delete device
            await this.devicesRepository.softRemove(item.id, {
              deviceSetting: true,
            });
            break;
          case DeviceType.GateWay:
            dataDelete = {
              ...dataDelete,
              deviceType: {
                id: DeviceType.GateWay,
              },
            };

            // adding data device that the user want to delete device in delete device table
            await this.deleteDevicesRepository.create(dataDelete);

            // delete device
            await this.devicesRepository.softRemove(item.id, {
              deviceSetting: true,
            });
            break;
          case DeviceType.SmartSwitch:
            dataDelete = {
              ...dataDelete,
              zone: { id: device.zone.id },
              deviceType: {
                id: DeviceType.SmartSwitch,
              },
            };

            // adding data device that the user want to delete device in delete device table
            await this.deleteDevicesRepository.create(dataDelete);

            // delete device
            await this.devicesRepository.softRemove(item.id);

            // update button position group equal 0 to group in zone
            await this.groupsService.update(
              { zoneId: device.zone.id },
              { buttonPosition: '0' },
            );
            break;

          case DeviceType.SmartSensor:
            const deviceSensor = await this.devicesRepository.find({
              address: device.address,
            });

            if (deviceSensor.length > 0) {
              for (let sensor of deviceSensor) {
                dataDelete = {
                  ...dataDelete,
                  zone: { id: sensor.zoneId },
                  deviceType: {
                    id: DeviceType.SmartSensor,
                  },
                  group: {
                    id: sensor.groupId,
                  },
                  protocolDeviceId: sensor.protocolDeviceId,
                };

                // adding data device that the user want to delete device in delete device table
                await this.deleteDevicesRepository.create(dataDelete);

                // delete device
                await this.devicesRepository.softRemove(sensor.id);
              }
            }

            break;
        }
      }),
    );
  }

  /**
   * This function is change area device assign
   *
   * @param user IJwt
   * @param changeAreaDeviceAssignDto ChangeAreaDeviceAssignDto
   * @returns IDevice
   */
  public async changeAreaAssign(
    user: IJwt,
    changeAreaDeviceAssignDto: ChangeAreaDeviceAssignDto,
  ): Promise<IDevice> {
    const device: IDevice = await this.findById(
      changeAreaDeviceAssignDto.deviceId,
    );

    if (!device) {
      throw new HttpException('DEVICES_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const floorData: IFloor = await this.floorsService.getAndCheckFloor(
      user,
      changeAreaDeviceAssignDto.floorId,
    );

    let zoneData: IZone;
    let groupData: IGroup;

    if (changeAreaDeviceAssignDto.zoneId) {
      //check zone exist and check zone with zone of floor
      zoneData = await this.zonesService.getAndCheckZone(
        floorData,
        changeAreaDeviceAssignDto.zoneId,
      );
    }

    if (changeAreaDeviceAssignDto.groupId) {
      //check group exist and check group with group of zone
      groupData = await this.groupsService.getAndCheckGroup(
        zoneData,
        changeAreaDeviceAssignDto.groupId,
      );
    }

    let data: any = {
      name: device.name,
      address: device.address,
      deviceType: { id: device.deviceType.id },
      building: { id: device.building.id },
      floor: { id: floorData.id },
      timeActive: new Date(),
    };
    let deleteDevice: IDeleteDevice;
    let whereDeleteDevice: any = {
      floor: {
        id: floorData.id,
      },
    };

    let result: IDevice;

    switch (device.deviceType.id) {
      case DeviceType.GateWay:
        whereDeleteDevice = {
          ...whereDeleteDevice,
          deviceTypeId: DeviceType.GateWay,
        };
        // check floor have existed device gateway
        let deviceGateway = await this.devicesRepository.find({
          deviceTypeId: DeviceType.GateWay,
          floorId: floorData.id,
        });

        // one floor only one device gateway
        if (deviceGateway.length >= LIMIT_DEVICE_GROUP) {
          throw new HttpException(
            'LIMIT_DEVICE_GATEWAY_OF_FLOOR',
            HttpStatus.BAD_REQUEST,
          );
        }

        deleteDevice = await this.deleteDevicesRepository.findOne(
          whereDeleteDevice,
          null,
          null,
          { protocolDeviceId: 'ASC' },
        );

        if (deleteDevice) {
          //delete data delete of device (delete-device table)
          await this.deleteDevicesRepository.softRemove(deleteDevice.id);

          data = {
            ...data,
            protocolDeviceId: deleteDevice.protocolDeviceId,
          };
        } else {
          data = {
            ...data,
            protocolDeviceId: deviceGateway.length + 1,
          };
        }

        // create new device gateway
        result = await this.devicesRepository.create(data);

        // delete device old
        await this.deleteDevicesRepository.create({
          floorId: device.floorId,
          deviceTypeId: DeviceType.GateWay,
          protocolDeviceId: device.protocolDeviceId,
        });

        await this.devicesRepository.softRemove(device.id);

        result = {
          ...result,
          floor: {
            ...result.floor,
            name: floorData.name,
          },
        };
        break;
      case DeviceType.SmartSwitch:
        data = {
          ...data,
          zone: { id: zoneData.id },
        };

        let deviceSmartSwitch = await this.devicesRepository.findOne({
          deviceTypeId: DeviceType.SmartSwitch,
          floorId: floorData.id,
          zoneId: zoneData.id,
        });

        // one zone only one device smart switch
        if (deviceSmartSwitch) {
          throw new HttpException(
            'LIMIT_DEVICE_SMART_SWITCH_OF_ZONE',
            HttpStatus.BAD_REQUEST,
          );
        }

        whereDeleteDevice = {
          ...whereDeleteDevice,
          zone: { id: zoneData.id },
          deviceTypeId: DeviceType.SmartSwitch,
        };

        deleteDevice = await this.deleteDevicesRepository.findOne(
          whereDeleteDevice,
          null,
          null,
          { protocolDeviceId: 'ASC' },
        );

        //delete data delete of device (delete-device table)
        if (deleteDevice) {
          await this.deleteDevicesRepository.softRemove(deleteDevice.id);
        }

        result = await this.devicesRepository.create({
          ...data,
          protocolDeviceId: 1,
        });

        // delete device smart switch old

        await this.deleteDevicesRepository.create({
          protocolDeviceId: device.protocolDeviceId,
          floor: { id: device.floor.id },
          zone: { id: device.zone.id },
          deviceTypeId: DeviceType.SmartSwitch,
        });

        await this.devicesRepository.softRemove(device.id);

        result = {
          ...result,
          floor: {
            ...result.floor,
            name: floorData.name,
          },
          zone: {
            ...result.zone,
            name: zoneData.name,
            protocolZoneId: zoneData.protocolZoneId,
          },
        };
        break;
      // case DeviceType.SmartSensor:
      case DeviceType.LightBulb:
        if (groupData.devices.length >= LIMIT_DEVICE_GROUP) {
          throw new HttpException(
            'LIMIT_DEVICE_OF_GROUP',
            HttpStatus.BAD_REQUEST,
          );
        }

        whereDeleteDevice = {
          ...whereDeleteDevice,
          group: {
            id: groupData.id,
          },
          zone: {
            id: zoneData.id,
          },
        };

        deleteDevice = await this.deleteDevicesRepository.findOne(
          whereDeleteDevice,
          null,
          null,
          { protocolDeviceId: 'ASC' },
        );

        // check device had already deleted. if true, we create again
        if (deleteDevice) {
          data = {
            ...data,
            zone: { id: zoneData.id },
            group: { id: groupData.id },
            protocolDeviceId: deleteDevice.protocolDeviceId,
          };
        } else {
          // case create smart sensor first, we must assign protocol device id equal one first
          let checkProtocolDeviceIdEqualOne =
            await this.devicesRepository.findOne({
              groupId: groupData.id,
              protocolDeviceId: 1,
            });

          // check protocol Device id is equal one, if we don't have, we assign protocol device id equal one
          if (!checkProtocolDeviceIdEqualOne) {
            data = {
              ...data,
              zone: { id: zoneData.id },
              group: { id: groupData.id },
              protocolDeviceId: 1,
            };
          } else {
            data = {
              ...data,
              zone: { id: zoneData.id },
              group: { id: groupData.id },
              protocolDeviceId: groupData.devices.length + 1,
            };
          }
        }

        result = await this.devicesRepository.create(data);

        //delete data delete of device (delete-device table)
        if (deleteDevice) {
          await this.deleteDevicesRepository.softRemove(deleteDevice.id);
        }

        await this.deleteDevicesRepository.create({
          protocolDeviceId: device.protocolDeviceId,
          group: { id: device.group.id },
          floor: { id: device.floor.id },
          zone: { id: device.zone.id },
          deviceTypeId: DeviceType.LightBulb,
        });

        await this.devicesRepository.softRemove(device.id);

        result = {
          ...result,
          floor: {
            ...result.floor,
            name: floorData.name,
          },
          zone: {
            ...result.zone,
            name: zoneData.name,
            protocolZoneId: zoneData.protocolZoneId,
          },
          group: {
            ...result.group,
            name: groupData.name,
            protocolGroupId: groupData.protocolGroupId,
          },
        };
        break;
      default:
        data = {
          ...data,
          zone: { id: zoneData.id },
          group: { id: groupData.id },
          protocolDeviceId: groupData.devices.length + 1,
        };

        result = await this.devicesRepository.create(data);

        //delete data delete of device (delete-device table)
        if (deleteDevice) {
          await this.deleteDevicesRepository.softRemove(deleteDevice.id);
        }

        await this.deleteDevicesRepository.create({
          protocolDeviceId: device.protocolDeviceId,
          group: { id: device.group.id },
          floor: { id: device.floor.id },
          zone: { id: device.zone.id },
        });

        await this.devicesRepository.softRemove(device.id);

        result = {
          ...result,
          floor: {
            ...result.floor,
            name: floorData.name,
          },
          zone: {
            ...result.zone,
            name: zoneData.name,
            protocolZoneId: zoneData.protocolZoneId,
          },
          group: {
            ...result.group,
            name: groupData.name,
            protocolGroupId: groupData.protocolGroupId,
          },
        };

        break;
    }

    return result;
  }

  /**
   * This function create device smart sensor

   * @param user IJwt
   * @param createDeviceSensorDto CreateDeviceSensorDto
   * @returns IDevice[]
   */
  public async createSensor(
    user: IJwt,
    createDeviceSensorDto: CreateDeviceSensorDto,
  ): Promise<IDevice[]> {
    const listDevice: any[] = createDeviceSensorDto.listDevice;

    let result: IDevice[] = [];

    for (let i = 0; i < listDevice.length; i++) {
      let groupId: number[];
      listDevice[i].group.map((group) => groupId.push(group.id));

      // check device register
      let checkRegister = await this.devicesRepository.find({
        address: listDevice[i].address,
        groupId: In(groupId),
      });
      if (checkRegister.length > 0) {
        throw new HttpException('DEVICE_REGISTER', HttpStatus.BAD_REQUEST);
      }

      // check device register another
      await this.checkAddressDevice(listDevice[i].address);

      //check floor exist and check floor with floor of user
      const floorData: IFloor = await this.floorsService.getAndCheckFloor(
        user,
        listDevice[i].floorId,
      );

      let zoneData: IZone;
      let groupData: any[] = [];

      //check zone exist and check zone with zone of floor
      zoneData = await this.zonesService.getAndCheckZone(
        floorData,
        listDevice[i].zoneId,
      );

      if (listDevice[i].option === OPTION_SENSOR.SINGLE) {
        for (let groupId of listDevice[i].group) {
          let group = await this.groupsService.getAndCheckGroup(
            zoneData,
            groupId.id,
          );

          groupData.push(group);
        }
      } else {
        for (let groupId of listDevice[i].group) {
          let group = await this.groupsService.getAndCheckGroup(
            zoneData,
            groupId.id,
          );
          let newGroup = {
            ...group,
            positionGroup: groupId.positionGroup,
          };

          groupData.push(newGroup);
        }
      }

      delete listDevice[i].group;
      delete listDevice[i].floorId;
      delete listDevice[i].zoneId;
      delete listDevice[i].deviceType;

      let data = {
        ...listDevice[i],
        floor: {
          id: floorData.id,
        },
        zone: { id: zoneData.id },
        building: { id: floorData.building.id },
        deviceType: { id: DeviceType.SmartSensor },
        timeActive: new Date(),
      };

      let deleteDevice: IDeleteDevice;

      let whereDeleteDevice: any = {
        floor: {
          id: floorData.id,
        },
        zone: {
          id: zoneData.id,
        },
      };

      switch (listDevice[i].option) {
        case OPTION_SENSOR.SINGLE:
          if (groupData.length != 1) {
            throw new BadRequestException('NUMBER_SINGLE_DEVICE_SMART_SENSOR');
          }

          // check number device of group
          if (groupData[0].devices.length >= LIMIT_DEVICE_GROUP) {
            throw new HttpException(
              'LIMIT_DEVICE_OF_GROUP',
              HttpStatus.BAD_REQUEST,
            );
          }

          whereDeleteDevice = {
            ...whereDeleteDevice,
            group: {
              id: groupData[0].id,
            },
            protocolDeviceId: MoreThan(1),
          };

          deleteDevice = await this.deleteDevicesRepository.findOne(
            whereDeleteDevice,
            null,
            null,
            { protocolDeviceId: 'ASC' },
          );

          // check device had already deleted. if true, we create again
          if (deleteDevice) {
            data = {
              ...data,
              option: OPTION_SENSOR.SINGLE,
              group: {
                id: groupData[0].id,
              },
              protocolDeviceId: deleteDevice.protocolDeviceId,
              positionGroup: 1,
            };

            // create device
            let deviceCreate = await this.devicesRepository.create(data);
            groupData[0].devices.push(deviceCreate);

            //delete data delete of device (delete-device table)
            await this.deleteDevicesRepository.softRemove(deleteDevice.id);

            result.push(deviceCreate);
          } else {
            // check group when group equal 0
            if (groupData[0].devices.length === 0) {
              // case create smart sensor the first times
              // when group don't have device, we assign protocol device id must be equal 2
              data = {
                ...data,
                option: OPTION_SENSOR.SINGLE,
                group: {
                  id: groupData[0].id,
                },
                protocolDeviceId: 2,
                positionGroup: 1,
              };
            } else {
              let protocolDeviceIdMax = await this.devicesRepository.findOne(
                {
                  groupId: groupData[0].id,
                },
                null,
                null,
                { protocolDeviceId: 'DESC' },
              );

              // when the protocol device id has a value greater than the number of devices in the group, we must add one plus for the protocol device id
              if (
                protocolDeviceIdMax.protocolDeviceId >=
                groupData[0].devices.length
              ) {
                data = {
                  ...data,
                  option: OPTION_SENSOR.SINGLE,
                  group: {
                    id: groupData[0].id,
                  },
                  protocolDeviceId: protocolDeviceIdMax.protocolDeviceId + 1,
                  positionGroup: 1,
                };
              } else {
                // when the protocol device id has a value smaller than the number of devices in the group, we must add one plus for the protocol device id
                data = {
                  ...data,
                  option: OPTION_SENSOR.SINGLE,
                  group: {
                    id: groupData[0].id,
                  },
                  protocolDeviceId: groupData[0].devices.length + 1,
                  positionGroup: 1,
                };
              }
            }

            // create device
            let deviceCreate = await this.devicesRepository.create(data);
            groupData[0].devices.push(deviceCreate);
            result.push(deviceCreate);
          }
          break;
        case OPTION_SENSOR.DOUBLE:
          if (groupData[0].positionGroup === groupData[1].positionGroup) {
            throw new BadRequestException('DUPLICATE_POSITION_GROUP');
          }

          if (groupData.length != 2) {
            throw new BadRequestException('NUMBER_DOUBLE_DEVICE_SMART_SENSOR');
          }

          for (let group of groupData) {
            if (group.devices.length >= LIMIT_DEVICE_GROUP) {
              throw new HttpException(
                'LIMIT_DEVICE_OF_GROUP',
                HttpStatus.BAD_REQUEST,
              );
            }

            whereDeleteDevice = {
              ...whereDeleteDevice,
              group: {
                id: group.id,
              },
              protocolDeviceId: MoreThan(1),
            };

            deleteDevice = await this.deleteDevicesRepository.findOne(
              whereDeleteDevice,
              null,
              null,
              { protocolDeviceId: 'ASC' },
            );

            // check device had already deleted. if true, we create again
            if (deleteDevice) {
              data = {
                ...data,
                option: OPTION_SENSOR.DOUBLE,
                group: { id: group.id },
                protocolDeviceId: deleteDevice.protocolDeviceId,
                positionGroup: group.positionGroup,
              };

              // create device
              let deviceCreate = await this.devicesRepository.create(data);
              group.devices.push(deviceCreate);

              //delete data delete of device (delete-device table)
              await this.deleteDevicesRepository.softRemove(deleteDevice.id);

              result.push(deviceCreate);
            } else {
              // check group when group equal 0
              if (group.devices.length === 0) {
                // case create smart sensor the first times
                // when group don't have device, we assign protocol device id must be equal 2
                data = {
                  ...data,
                  option: OPTION_SENSOR.DOUBLE,
                  group: {
                    id: group.id,
                  },

                  protocolDeviceId: group.devices.length + 2,
                  positionGroup: group.positionGroup,
                };
              } else {
                let protocolDeviceIdMax = await this.devicesRepository.findOne(
                  {
                    groupId: group.id,
                  },
                  null,
                  null,
                  { protocolDeviceId: 'DESC' },
                );

                if (
                  protocolDeviceIdMax.protocolDeviceId >= group.devices.length
                ) {
                  // when the protocol device id has a value greater than the number of devices in the group, we must add one plus for the protocol device id
                  data = {
                    ...data,
                    option: OPTION_SENSOR.DOUBLE,
                    group: {
                      id: group.id,
                    },
                    protocolDeviceId: protocolDeviceIdMax.protocolDeviceId + 1,
                    positionGroup: group.positionGroup,
                  };
                } else {
                  // when the protocol device id has a value smaller than the number of devices in the group, we must add one plus for the protocol device id
                  data = {
                    ...data,
                    option: OPTION_SENSOR.DOUBLE,
                    group: {
                      id: group.id,
                    },
                    protocolDeviceId: group.devices.length + 1,
                    positionGroup: group.positionGroup,
                  };
                }
              }

              // create device
              let deviceCreate = await this.devicesRepository.create(data);
              group.devices.push(deviceCreate);
              result.push(deviceCreate);
            }
          }
          break;
      }
    }
    return result;
  }

  /**
   * This function change assign group to sensor

   * @param user IJwt
   * @param changeAreaSensorAssignDto ChangeAreaSensorAssignDto
   * @returns IDevice[]
   */
  public async changeAreaAssignSensor(
    user: IJwt,
    changeAreaSensorAssignDto: ChangeAreaSensorAssignDto,
  ): Promise<IDevice[]> {
    const device: IDevice = await this.findById(
      changeAreaSensorAssignDto.deviceId,
    );

    if (!device) {
      throw new HttpException('DEVICES_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const deviceOld = await this.devicesRepository.find({
      address: device.address,
    });

    const floorData: IFloor = await this.floorsService.getAndCheckFloor(
      user,
      changeAreaSensorAssignDto.floorId,
    );

    let zoneData: IZone;
    let groupData: any[] = [];

    //check zone exist and check zone with zone of floor
    zoneData = await this.zonesService.getAndCheckZone(
      floorData,
      changeAreaSensorAssignDto.zoneId,
    );

    //find group change assign
    if (device.option === OPTION_SENSOR.SINGLE) {
      let group = await this.groupsService.getAndCheckGroup(
        zoneData,
        changeAreaSensorAssignDto.group[0].id,
      );

      groupData.push(group);
    } else {
      for (let groupId of changeAreaSensorAssignDto.group) {
        let group = await this.groupsService.getAndCheckGroup(
          zoneData,
          groupId.id,
        );

        let newGroup = {
          ...group,
          positionGroup: groupId.positionGroup,
        };

        groupData.push(newGroup);
      }
    }

    let data: any = {
      name: device.name,
      address: device.address,
      deviceType: { id: device.deviceType.id },
      building: { id: device.building.id },
      floor: { id: floorData.id },
      zone: { id: zoneData.id },
      timeActive: new Date(),
    };

    let deleteDevice: IDeleteDevice;
    let whereDeleteDevice: any = {
      floor: {
        id: floorData.id,
      },
      zone: {
        id: zoneData.id,
      },
    };

    let result: IDevice[] = [];

    switch (device.option) {
      case OPTION_SENSOR.SINGLE:
        // check number device of group
        if (groupData[0].devices.length >= LIMIT_DEVICE_GROUP) {
          throw new HttpException(
            'LIMIT_DEVICE_OF_GROUP',
            HttpStatus.BAD_REQUEST,
          );
        }

        whereDeleteDevice = {
          ...whereDeleteDevice,
          group: {
            id: groupData[0].id,
          },
          protocolDeviceId: MoreThan(1),
        };

        deleteDevice = await this.deleteDevicesRepository.findOne(
          whereDeleteDevice,
          null,
          null,
          { protocolDeviceId: 'ASC' },
        );

        // check device had already deleted. if true, we create again
        if (deleteDevice) {
          data = {
            ...data,
            option: OPTION_SENSOR.SINGLE,
            group: {
              id: groupData[0].id,
            },
            protocolDeviceId: deleteDevice.protocolDeviceId,
            positionGroup: 1,
          };

          //delete data delete of device (delete-device table)
          await this.deleteDevicesRepository.softRemove(deleteDevice.id);
        } else {
          // check group when group equal 0
          if (groupData[0].devices.length === 0) {
            // case create smart sensor the first times
            // when group don't have device, we assign protocol device id must be equal 2
            data = {
              ...data,
              option: OPTION_SENSOR.SINGLE,
              group: {
                id: groupData[0].id,
              },
              protocolDeviceId: 2,
              positionGroup: 1,
            };
          } else {
            let protocolDeviceIdMax = await this.devicesRepository.findOne(
              {
                groupId: groupData[0].id,
              },
              null,
              null,
              { protocolDeviceId: 'DESC' },
            );

            // when the protocol device id has a value greater than the number of devices in the group, we must add one plus for the protocol device id
            if (
              protocolDeviceIdMax.protocolDeviceId >=
              groupData[0].devices.length
            ) {
              data = {
                ...data,
                option: OPTION_SENSOR.SINGLE,
                group: {
                  id: groupData[0].id,
                },
                protocolDeviceId: protocolDeviceIdMax.protocolDeviceId + 1,
                positionGroup: 1,
              };
            } else {
              data = {
                ...data,
                option: OPTION_SENSOR.SINGLE,
                group: {
                  id: groupData[0].id,
                },
                protocolDeviceId: groupData[0].devices.length + 1,
                positionGroup: 1,
              };
            }
          }
        }
        // create device
        let deviceCreate: IDevice = await this.devicesRepository.create(data);

        //delete device smart sensor old
        await this.deleteDevicesRepository.create({
          protocolDeviceId: device.protocolDeviceId,
          group: { id: device.group.id },
          floor: { id: device.floor.id },
          zone: { id: device.zone.id },
          deviceTypeId: DeviceType.SmartSensor,
        });

        await this.devicesRepository.softRemove(device.id);

        deviceCreate = {
          ...deviceCreate,
          floor: {
            ...deviceCreate.floor,
            name: floorData.name,
          },
          zone: {
            ...deviceCreate.zone,
            name: zoneData.name,
            protocolZoneId: zoneData.protocolZoneId,
          },
          group: {
            ...deviceCreate.group,
            name: groupData[0].name,
            protocolGroupId: groupData[0].protocolGroupId,
          },
        };

        result.push(deviceCreate);
        break;
      case OPTION_SENSOR.DOUBLE:
        if (groupData.length != 2) {
          throw new BadRequestException('NUMBER_DOUBLE_DEVICE_SMART_SENSOR');
        }
        if (groupData[0].positionGroup === groupData[1].positionGroup) {
          throw new BadRequestException('DUPLICATE_POSITION_GROUP');
        }

        for (let group of groupData) {
          let checkGroup = deviceOld.some(
            (devices: any) => devices.groupId === group.id,
          );

          if (group.devices.length >= LIMIT_DEVICE_GROUP && !checkGroup) {
            throw new HttpException(
              'LIMIT_DEVICE_OF_GROUP',
              HttpStatus.BAD_REQUEST,
            );
          }

          whereDeleteDevice = {
            ...whereDeleteDevice,
            group: {
              id: group.id,
            },
            protocolDeviceId: MoreThan(1),
          };

          deleteDevice = await this.deleteDevicesRepository.findOne(
            whereDeleteDevice,
            null,
            null,
            { protocolDeviceId: 'ASC' },
          );

          if (checkGroup) {
            let sensorOfGroup = await this.devicesRepository.findOne({
              group: { id: group.id },
              deviceType: { id: DeviceType.SmartSensor },
            });
            data = {
              ...data,
              option: OPTION_SENSOR.DOUBLE,
              group: { id: group.id },
              protocolDeviceId: sensorOfGroup.protocolDeviceId,
              positionGroup: group.positionGroup,
            };
          }
          // check device had already deleted. if true, we create again
          else if (deleteDevice) {
            data = {
              ...data,
              option: OPTION_SENSOR.DOUBLE,
              group: { id: group.id },
              protocolDeviceId: deleteDevice.protocolDeviceId,
              positionGroup: group.positionGroup,
            };
          } else {
            if (group.devices.length === 0) {
              data = {
                ...data,
                option: OPTION_SENSOR.DOUBLE,
                group: { id: group.id },
                protocolDeviceId: 2,
                positionGroup: group.positionGroup,
              };
            } else {
              let protocolDeviceIdMax = await this.devicesRepository.findOne(
                {
                  groupId: group.id,
                },
                null,
                null,
                { protocolDeviceId: 'DESC' },
              );
              // when the protocol device id has a value greater than the number of devices in the group, we must add one plus for the protocol device id
              if (
                protocolDeviceIdMax.protocolDeviceId >= group.devices.length
              ) {
                data = {
                  ...data,
                  option: OPTION_SENSOR.DOUBLE,
                  group: {
                    id: group.id,
                  },
                  protocolDeviceId: protocolDeviceIdMax.protocolDeviceId + 1,
                  positionGroup: group.positionGroup,
                };
              } else {
                // when the protocol device id has a value smaller than the number of devices in the group, we must add one plus for the protocol device id
                data = {
                  ...data,
                  option: OPTION_SENSOR.DOUBLE,
                  group: {
                    id: group.id,
                  },
                  protocolDeviceId: group.devices.length + 1,
                  positionGroup: group.positionGroup,
                };
              }
            }
          }

          // create device
          let deviceCreate: IDevice = await this.devicesRepository.create(data);

          //delete data delete of device (delete-device table)
          if (deleteDevice) {
            await this.deleteDevicesRepository.softRemove(deleteDevice.id);
          }

          deviceCreate = {
            ...deviceCreate,
            floor: {
              ...deviceCreate.floor,
              name: floorData.name,
            },
            zone: {
              ...deviceCreate.zone,
              name: zoneData.name,
              protocolZoneId: zoneData.protocolZoneId,
            },
            group: {
              ...deviceCreate.group,
              name: group.name,
              protocolGroupId: group.protocolGroupId,
            },
          };

          result.push(deviceCreate);
        }

        //delete old data device
        for (let oldData of deviceOld) {
          await this.deleteDevicesRepository.create({
            protocolDeviceId: oldData.protocolDeviceId,
            group: { id: oldData.groupId },
            floor: { id: oldData.floorId },
            zone: { id: oldData.zoneId },
            deviceTypeId: DeviceType.SmartSensor,
          });

          await this.devicesRepository.softRemove(oldData.id);
        }

        break;
    }

    return result;
  }

  /**
   * This function to update setting of device
   *
   * @param deviceId number
   * @param data UpdateDeviceSettingDto
   * @returns IDevice
   */
  async updateDeviceSetting(
    deviceId: number,
    data: UpdateDeviceSettingDto,
  ): Promise<IDevice> {
    let device: IDevice = await this.findById(deviceId);

    let dataUpdate = {
      id: deviceId,
      deviceSetting: data,
    };

    const dataDevice = await this.devicesRepository.create(dataUpdate);

    device = await this.findById(deviceId);

    return device;
  }

  /**
   * This function change name of device

   *@param user IJwt
   * @param changeNameDeviceDto ChangeNameDeviceDto
   * @returns IDevice
   */
  public async changeNameDevice(
    user: IJwt,
    changeNameDeviceDto: ChangeNameDeviceDto,
  ): Promise<IDevice> {
    let deviceOld: IDevice = await this.findById(changeNameDeviceDto.id);

    if (!deviceOld) {
      throw new HttpException('DEVICES_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // check name of device before change name of device
    await this.checkNameDevice(changeNameDeviceDto.name);

    //check floor exist and check floor with floor of user
    const floorData: IFloor = await this.floorsService.getAndCheckFloor(
      user,
      deviceOld.floorId,
    );
    let group: IGroup[] = [];

    const listDevice = await this.devicesRepository.find({
      address: deviceOld.address,
    });

    for (let device of listDevice) {
      let data = await this.devicesRepository.updateOneAndReturnById(
        device.id,
        { name: changeNameDeviceDto.name },
      );

      group.push(data.group);
    }

    delete deviceOld.group;

    let result: any = {
      ...deviceOld,
      group: group,
      name: changeNameDeviceDto.name,
    };

    return result;
  }

  /**
   * This function get list sensor option single

   * @param user IJwt
   * @param getListSensorSingleDto GetListSensorSingleDto
   * @returns IPagination
   */
  public async getListSensorSingle(
    user: IJwt,
    getListSensorSingleDto: GetListSensorSingleDto,
  ): Promise<IPagination> {
    const page = getListSensorSingleDto.page ? getListSensorSingleDto.page : 1;
    const limit = getListSensorSingleDto.limit
      ? getListSensorSingleDto.limit
      : 10;
    const sortType = getListSensorSingleDto.sortType;
    const sortBy = getListSensorSingleDto.sortBy
      ? getListSensorSingleDto.sortBy
      : '';
    const keyword = getListSensorSingleDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    let where = {};
    where = {
      ...where,
      deviceType: { id: DeviceType.SmartSensor },
    };

    if (getListSensorSingleDto.keyword) {
      where = { ...where, name: Like(`%${keyword}%`) };
    }

    //check group exist
    const groupData = await this.groupsService.getDetail(
      getListSensorSingleDto.groupId,
    );
    await this.groupsService.checkFloorOfGroupWithFloorOfUser(user, groupData);

    where = {
      ...where,
      group: { id: groupData.id },
      option: 'single',
    };
    if (sortBy) {
      order = {
        [sortBy]: sortType,
      };
    } else {
      order = {
        id: sortType,
      };
    }

    const [devices, total] = await this.devicesRepository.findAndCount(
      where,
      null,
      { id: true, name: true, address: true, masterSensor: true },
      limit,
      skip,
      order,
    );

    const result = this.paginationService.pagination(
      devices,
      total,
      page,
      limit,
    );

    return result;
  }

  /**
   * This method get list device by gateway

   * @param gatewayId number
   * @param getListDeviceByGatewayDto GetListDeviceByGatewayDto
   * @returns IPagination
   */
  public async getListDeviceByGateway(
    gatewayId: number,
    getListDeviceByGatewayDto: GetListDeviceByGatewayDto,
  ): Promise<IPagination> {
    let device: IDevice = await this.findById(gatewayId);

    if (!device) {
      throw new HttpException('DEVICES_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // check device is type gateway
    if (device.deviceType.id != DeviceType.GateWay) {
      throw new HttpException('DEVICE_MUST_GATEWAY', HttpStatus.FORBIDDEN);
    }

    const page = getListDeviceByGatewayDto.page
      ? getListDeviceByGatewayDto.page
      : 1;
    const limit = getListDeviceByGatewayDto.limit
      ? getListDeviceByGatewayDto.limit
      : 10;
    const sortType = getListDeviceByGatewayDto.sortType;
    const sortBy = getListDeviceByGatewayDto.sortBy
      ? getListDeviceByGatewayDto.sortBy
      : '';
    const keyword = getListDeviceByGatewayDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    let where = {};

    if (getListDeviceByGatewayDto.keyword) {
      where = { ...where, name: Like(`%${keyword}%`) };
    }

    const listZone = await this.zonesService.find({
      gatewayManageArea: { device: { id: gatewayId } },
    });

    let zoneArray: any[] = [];

    listZone.map((zone) => zoneArray.push(zone.id));

    where = {
      ...where,
      floor: { id: device.floor.id },
    };

    if (
      !getListDeviceByGatewayDto.zoneId ||
      getListDeviceByGatewayDto.zoneId[0] === ''
    ) {
      where = {
        ...where,
        zoneId: In(zoneArray),
      };
    } else {
      //Check that the input zone is in the list of zones that the gateway handles
      for (let zoneId of getListDeviceByGatewayDto.zoneId) {
        let checkZone = listZone.some(
          (zone: any) => Number(zoneId) === zone.id,
        );
        if (!checkZone) {
          throw new HttpException(
            'ZONE_NOT_CONTROL_GATEWAY',
            HttpStatus.FORBIDDEN,
          );
        }
      }

      if (
        !getListDeviceByGatewayDto.groupId ||
        getListDeviceByGatewayDto.groupId[0] == ''
      ) {
        where = {
          ...where,
          zoneId: In(getListDeviceByGatewayDto.zoneId),
        };
      } else {
        where = {
          ...where,
          groupId: In(getListDeviceByGatewayDto.groupId),
        };
      }
    }

    if (getListDeviceByGatewayDto.lightingStatus != null) {
      where = {
        ...where,
        lightingStatus: getListDeviceByGatewayDto.lightingStatus,
      };
    }

    const [devices, total] = await this.devicesRepository.findAndCount(
      where,
      {
        floor: true,
        zone: true,
        group: true,
        deviceType: true,
      },
      {
        floor: { id: true, name: true },
        zone: { id: true, name: true },
        group: { id: true, name: true },
        deviceType: { id: true, type: true },
      },
      limit,
      skip,
      order,
    );

    const result = this.paginationService.pagination(
      devices,
      total,
      page,
      limit,
    );

    return result;
  }

  /**
   * This function to assign area for gateway

   * @param user IJwt
   * @param assignAreaForGatewayDto AssignAreaForGatewayDto
   * @returns IPagination
   */
  public async assignAreaForGateway(
    user: IJwt,
    assignAreaForGatewayDto: AssignAreaForGatewayDto,
  ): Promise<IDevice> {
    // check floor exist
    let dataFloor: IFloor = await this.floorsService.getDetailFloors(
      assignAreaForGatewayDto.floorId,
    );

    // check device gateway exist
    await this.getDetailDevice(assignAreaForGatewayDto.deviceId);

    // check device gateway belong to floor
    let dataDevice: IDevice = await this.devicesRepository.findOne({
      deviceTypeId: DeviceType.GateWay,
      floorId: assignAreaForGatewayDto.floorId,
    });

    if (!dataDevice) {
      throw new HttpException(
        'DEVICE_NOT_EXIST_IN_FLOOR',
        HttpStatus.NOT_FOUND,
      );
    }

    let data: any[] = [];

    await Promise.all(
      assignAreaForGatewayDto.zone.map(async (zone: any) => {
        // check zone exist
        let dataZone: IZone = await this.zonesService.getDetail(zone.id);
        // check zone must belong to the floor
        await this.zonesService.checkZoneOfFloor(dataFloor, dataZone);

        data.push({
          deviceId: assignAreaForGatewayDto.deviceId,
          floorId: assignAreaForGatewayDto.floorId,
          zoneId: zone.id,
        });
      }),
    );

    let listDeleteAreaOfGateway = await this.gatewayManageAreaRepository.find({
      deviceId: assignAreaForGatewayDto.deviceId,
      floorId: assignAreaForGatewayDto.floorId,
    });

    await Promise.all(
      listDeleteAreaOfGateway.map(async (item: any) => {
        await this.gatewayManageAreaRepository.softRemove(item.id);
      }),
    );

    // assign area for gateway
    await this.gatewayManageAreaRepository.insert(data);

    return await this.findById(assignAreaForGatewayDto.deviceId);
  }

  /**
   * This function to check device smart switch registered in floor

   * @param floorId number
   * @returns any
   */
  async checkDeviceSmartGateway(floorId: number): Promise<any> {
    let device = await this.devicesRepository.find({
      deviceTypeId: DeviceType.GateWay,
      floorId: floorId,
    });

    let dataDevice: any;

    if (device.length > 0) {
      dataDevice = {
        isRegistered: true,
        gateway: device,
      };
    } else {
      dataDevice = {
        isRegistered: false,
        gateway: null,
      };
    }

    return dataDevice;
  }
}
