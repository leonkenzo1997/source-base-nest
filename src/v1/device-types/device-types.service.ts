import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { BaseService } from '../../base/base.service';
import { IPagination } from '../../interfaces/pagination.interface';
import { PaginationService } from '../../utils/pagination.service';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { GetDeviceTypeDto } from './dto/get-device-type.dto';
import { UpdateDeviceTypeDto } from './dto/update-device-type.dto';
import { DeviceType } from './entities/device-type.entity';
import { IDeviceType } from './interfaces/device-types.interface';
import { DeviceTypesRepository } from './repositories/device-types.repository';

@Injectable()
export class DeviceTypesService extends BaseService<
  DeviceType,
  DeviceTypesRepository
> {
  constructor(
    private readonly deviceTypesRepository: DeviceTypesRepository,
    private paginationService: PaginationService,
  ) {
    super(deviceTypesRepository);
  }

  /**
   * This method: find by id of data device type
   *
   * @param id number
   * @returns IDeviceType
   */
  public async findbyId(id: number): Promise<IDeviceType> {
    const result = await this.deviceTypesRepository.findOne(
      { id: id },
      { otas: true },
    );

    if (!result) {
      throw new HttpException('DEVICE_TYPE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  /**
   * This method:  get list device type
   *
   * @param getDeviceTypeDto GetDeviceTypeDto
   * @returns IPagination
   */
  async getList(getDeviceTypeDto: GetDeviceTypeDto): Promise<IPagination> {
    const page = getDeviceTypeDto.page ? getDeviceTypeDto.page : 1;
    const limit = getDeviceTypeDto.limit ? getDeviceTypeDto.limit : 10;
    const sortType = getDeviceTypeDto.sortType;
    const sortBy = getDeviceTypeDto.sortBy ? getDeviceTypeDto.sortBy : '';
    const keyword = getDeviceTypeDto.keyword;
    const skip = (page - 1) * limit;
    let order = {};
    const where = {};

    if (getDeviceTypeDto.keyword) {
      where['type'] = Like(`%${keyword}%`);
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

    const [deviceType, total] = await this.deviceTypesRepository.findAndCount(
      where,
      null,
      null,
      limit,
      skip,
      order,
    );

    const result = this.paginationService.pagination(
      deviceType,
      total,
      page,
      limit,
    );
    return result;
  }

  /**
   * This method to create device types
   *
   * @param createDeviceTypeDto CreateDeviceTypeDto
   * @returns IDeviceType
   */
  async createDeviceType(
    createDeviceTypeDto: CreateDeviceTypeDto,
  ): Promise<IDeviceType> {
    let deviceType: IDeviceType = await this.deviceTypesRepository.create(
      createDeviceTypeDto,
    );

    return deviceType;
  }

  /**
   * This method is update data of device types by id
   *
   * @param id number
   * @param updateDeviceTypeDto UpdateDeviceTypeDto
   * @returns IDeviceType
   */
  async updateDeviceType(
    id: number,
    updateDeviceTypeDto: UpdateDeviceTypeDto,
  ): Promise<IDeviceType> {
    let deviceType: IDeviceType = await this.findbyId(id);

    let deviceTypeData: IDeviceType =
      await this.deviceTypesRepository.updateOneAndReturnById(
        deviceType.id,
        updateDeviceTypeDto,
      );

    return deviceTypeData;
  }
}
