import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { BaseService } from '../../base/base.service';
import { IPagination } from '../../interfaces/pagination.interface';
import { PaginationService } from '../../utils/pagination.service';
import { TokenService } from '../../utils/token.service';
import { IJwt } from '../authentication/interfaces/jwt.interface';
import { DeviceType } from '../device-types/device-types.const';
import { DevicesService } from '../devices/devices.service';
import { FloorsService } from '../floors/floors.service';
import { SceneService } from '../scene/scene.service';
import { IUser } from '../users/interfaces/user.interface';
import { UsersService } from '../users/users.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { GetListScheduleForMobileDto } from './dto/get-list-schedule.dto';
import { UpdateNameScheduleDto } from './dto/update-name-schedule.dto';
import { UpdateSettingScheduleDto } from './dto/update-setting-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { ISchedule } from './interfaces/schedule.interface';
import { DeleteScheduleRepository } from './repositories/delete-schedule.repository';
import { ScheduleRepository } from './repositories/schedule.repository';
import {
  ORDER_BY_SCHEDULE,
  ScheduleType,
  SCHEDULE_RELATION,
  SCHEDULE_SELECT
} from './schedule.const';

@Injectable()
export class ScheduleService extends BaseService<Schedule, ScheduleRepository> {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly deleteScheduleRepository: DeleteScheduleRepository,
    private floorsService: FloorsService,
    private sceneService: SceneService,
    private usersService: UsersService,
    private tokenService: TokenService,
    private paginationService: PaginationService,
    private readonly devicesService: DevicesService,
  ) {
    super(scheduleRepository);
  }

  /**
   * This function create schedule
   *
   * @param user IJwt
   * @param createScheduleDto createScheduleDto
   * @returns ISchedule
   */
  public async createSchedule(
    user: IJwt,
    createScheduleDto: CreateScheduleDto,
  ): Promise<ISchedule> {
    let floor = await this.floorsService.getDetailFloors(
      createScheduleDto.floorId,
    );

    let checkFloor: boolean = floor.users.some((item: any) => {
      item.id !== user.userId;
    });

    if (checkFloor) {
      throw new HttpException(
        'FLOOR_NOT_MATCH_USER_FLOOR',
        HttpStatus.BAD_REQUEST,
      );
    }

    // check scene
    let scene = await this.sceneService.detailScene(
      user,
      createScheduleDto.sceneId,
    );

    if (scene.floor.id !== createScheduleDto.floorId) {
      throw new HttpException(
        'FLOOR_NOT_MATCH_SCENE_FLOOR',
        HttpStatus.BAD_REQUEST,
      );
    }

    // check floor with floor of scene
    await this.checkFloorWithFloorOfScene(
      scene.floor.id,
      createScheduleDto.floorId,
    );

    // check name schedule exist
    await this.checkNameSchedule(createScheduleDto.name);

    // check  quantity of schedule in floor
    if (floor.schedules.length >= 30) {
      throw new HttpException(
        'LIMIT_SCHEDULE_OF_FLOOR',
        HttpStatus.BAD_REQUEST,
      );
    }

    const deleteSchedule = await this.deleteScheduleRepository.findOne(
      {
        floor: { id: floor.id },
      },
      null,
      null,
      { protocolScheduleId: 'ASC' },
    );

    // data for schedule
    let dataSchedule: any = {
      ...createScheduleDto,
      floor: { id: createScheduleDto.floorId },
      scene: { id: createScheduleDto.sceneId },
      createdBy: {
        id: user.userId,
      },
      buildingId: floor.building.id,
    };

    delete dataSchedule.floorId;
    delete dataSchedule.sceneId;

    let schedule: ISchedule;

    if (deleteSchedule) {
      dataSchedule = {
        ...dataSchedule,
        protocolScheduleId: deleteSchedule.protocolScheduleId,
      };
      schedule = await this.scheduleRepository.create(dataSchedule);
      await this.deleteScheduleRepository.softRemove(deleteSchedule.id);
    } else {
      dataSchedule = {
        ...dataSchedule,
        protocolScheduleId: floor.schedules.length + 1,
      };

      schedule = await this.scheduleRepository.create(dataSchedule);
    }

    return schedule;
  }

  /**
   * This function check name schedule exist
   *
   * @param name string
   * @returns void
   */
  async checkNameSchedule(name: string): Promise<void> {
    let checkName = await this.scheduleRepository.findOne({ name: name });

    if (checkName) {
      throw new HttpException('SCHEDULE_NAME_EXISTED', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * This function get list of schedules
   *
   * @param getListScheduleForMobileDto: GetListScheduleForMobileDto
   * @returns IPagination
   */
  async getListSchedule(
    getListScheduleForMobileDto: GetListScheduleForMobileDto,
  ): Promise<IPagination> {
    const page = getListScheduleForMobileDto.page
      ? getListScheduleForMobileDto.page
      : 1;
    const limit = getListScheduleForMobileDto.limit
      ? getListScheduleForMobileDto.limit
      : 10;
    const sortType = getListScheduleForMobileDto.sortType;
    const sortBy = getListScheduleForMobileDto.sortBy
      ? getListScheduleForMobileDto.sortBy
      : '';
    const keyword = getListScheduleForMobileDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    let where = {};

    if (getListScheduleForMobileDto.keyword) {
      where['name'] = Like(`%${keyword}%`);
    }

    if (getListScheduleForMobileDto.buildingId) {
      where = {
        ...where,
        buildingId: getListScheduleForMobileDto.buildingId,
      };
    }

    if (getListScheduleForMobileDto.floorId) {
      where = {
        ...where,
        floor: { id: getListScheduleForMobileDto.floorId },
      };
    }

    if (getListScheduleForMobileDto.type) {
      where = {
        ...where,
        type: getListScheduleForMobileDto.type,
      };
    }

    if (sortBy) {
      switch (sortBy) {
        case ORDER_BY_SCHEDULE.FLOOR:
        case ORDER_BY_SCHEDULE.BUILDING:
        case ORDER_BY_SCHEDULE.SCENE:
          order = {
            [sortBy]: {
              name: sortType,
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

    // get data and total data
    const [schedules, total] = await this.scheduleRepository.findAndCount(
      where,
      SCHEDULE_RELATION,
      SCHEDULE_SELECT,
      limit,
      skip,
      order,
    );

    const result = this.paginationService.pagination(
      schedules,
      total,
      page,
      limit,
    );
    return result;
  }

  /**
   * This method edit name of schedule via schedule id
   *
   * @param userId number
   * @param scheduleId number
   * @param updateNameScheduleDto UpdateNameScheduleDTO
   * @returns ISchedule
   */
  async updateNameOfSchedule(
    userId: number,
    scheduleId: number,
    updateNameScheduleDto: UpdateNameScheduleDto,
  ): Promise<ISchedule> {
    //check schedule id exist
    let schedule: ISchedule = await this.findById(scheduleId);

    let user: IUser = await this.usersService.findById(userId);

    //check floor of user with floor of schedule
    await this.checkFloorUserWithFloorSchedule(user.floors, schedule.floor.id);

    // check name of schedule exist
    await this.checkNameSchedule(updateNameScheduleDto.name);

    // update name of schedule
    let results = await this.scheduleRepository.updateOneAndReturnById(
      schedule.id,
      updateNameScheduleDto,
      {
        scene: true,
      },
      {
        scene: { id: true, name: true },
      },
    );

    return results;
  }

  /**
   * This method edit setting of schedule via schedule id
   *
   * @param userId number
   * @param scheduleId number
   * @param updateSettingScheduleDto UpdateNameScheduleDTO
   * @returns ISchedule
   */
  async updateSettingSchedule(
    userId: number,
    scheduleId: number,
    updateSettingScheduleDto: UpdateSettingScheduleDto,
  ): Promise<ISchedule> {
    //check schedule id exist
    let schedule: ISchedule = await this.findById(scheduleId);

    let user: IUser = await this.usersService.findById(userId);

    //check floor of user with floor of schedule
    await this.checkFloorUserWithFloorSchedule(user.floors, schedule.floor.id);

    let dataUpdate = {
      ...updateSettingScheduleDto,
      scene: { id: updateSettingScheduleDto.sceneId },
    };

    delete dataUpdate.sceneId;

    switch (schedule.type) {
      case ScheduleType.DAILY:
        delete updateSettingScheduleDto.date;
        delete updateSettingScheduleDto.months;
        delete updateSettingScheduleDto.dayOfWeek;
        delete updateSettingScheduleDto.years;
        break;

      case ScheduleType.DAY_OF_WEEK:
        delete updateSettingScheduleDto.date;
        delete updateSettingScheduleDto.months;
        delete updateSettingScheduleDto.years;
        break;
      case ScheduleType.SPECIFIC_DATE:
        delete updateSettingScheduleDto.dayOfWeek;
        break;
      default:
        break;
    }

    // update name of schedule
    let results = await this.scheduleRepository.updateOneAndReturnById(
      schedule.id,
      dataUpdate,
      {
        scene: true,
      },
      {
        scene: { id: true, name: true },
      },
    );

    return results;
  }

  /**
   * This function check floor of user with floor of schedule
   *
   * @param floorOfUser any[]
   * @param floorOfScheduleId number
   * @returns void
   */
  private async checkFloorUserWithFloorSchedule(
    floorOfUser: any[],
    floorOfScheduleId: number,
  ): Promise<void> {
    //check floor of user with floor of schedule
    let checkFloorUserWithFloorSchedule: boolean = floorOfUser.some(
      (floor: any) => floor.id === floorOfScheduleId,
    );

    if (!checkFloorUserWithFloorSchedule) {
      throw new HttpException(
        'FLOOR_USER_NOT_MATCH_FLOOR_SCHEDULE',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * This function delete schedule by id
   * @param userData IJwt
   * @param scheduleId number
   * @returns void
   */
  public async deleteSchedule(
    userData: IJwt,
    scheduleId: number,
  ): Promise<void> {
    //check schedule in system
    let schedule: ISchedule = await this.findById(scheduleId);

    // get list floor data of user
    let user: IUser = await this.usersService.findById(userData.userId);

    //check floor of user with floor of schedule
    await this.checkFloorUserWithFloorSchedule(user.floors, schedule.floor.id);

    await this.deleteScheduleRepository.create({
      protocolScheduleId: schedule.protocolScheduleId,
      floor: { id: schedule.floor.id },
      scene: { id: schedule.scene.id },
    });

    // delete schedule
    await this.scheduleRepository.softRemove(
      //id of schedule
      scheduleId,
    );
  }

  /**
   * This function find one schedule via schedule id
   *
   * @param scheduleId number
   * @returns ISchedule | null
   */
  async getDetailSchedule(scheduleId: number): Promise<ISchedule> {
    let schedule: ISchedule = await this.findById(scheduleId);
    return schedule;
  }

  /**
   * This function find one schedule via schedule id
   *
   * @param id number
   * @returns ISchedule | null
   */
  private async findById(id: number): Promise<ISchedule> {
    const where = { id };
    let schedule = await this.scheduleRepository.findOne(
      where,
      SCHEDULE_RELATION,
      SCHEDULE_SELECT,
    );

    if (!schedule) {
      throw new HttpException('SCHEDULE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return schedule;
  }

  /**
   * This function check floor with floor of scene
   *
   * @param floorId number
   * @param floorIdOfScene number
   * @returns void
   */
  private async checkFloorWithFloorOfScene(
    floorId: number,
    floorIdOfScene: number,
  ): Promise<void> {
    if (floorIdOfScene !== floorId) {
      throw new HttpException(
        'FLOOR_NOT_MATCH_SCENE_FLOOR',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * This method get list schedule by device
   * @param deviceId number
   * @param getListScheduleForMobileDto GetListScheduleForMobileDto
   * @returns IPagination
   */
  public async getListScheduleByDevice(
    deviceId: number,
    getListScheduleForMobileDto: GetListScheduleForMobileDto,
  ): Promise<IPagination> {
    const device = await this.devicesService.findById(deviceId);

    // check device registration
    if (!device) {
      throw new HttpException('DEVICES_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // check device type in smart switch
    if (device.deviceType.id != DeviceType.SmartSwitch) {
      throw new HttpException('DEVICE_MUST_SMART_SWITCH', HttpStatus.FORBIDDEN);
    }

    let getListSchedule = {
      ...getListScheduleForMobileDto,
    };

    delete getListSchedule.buildingId;

    delete getListSchedule.floorId;

    getListSchedule = {
      ...getListSchedule,
      buildingId: device.building.id,
      floorId: device.floor.id,
    };

    const listSchedule = await this.getListSchedule(getListSchedule);

    return listSchedule;
  }
}
