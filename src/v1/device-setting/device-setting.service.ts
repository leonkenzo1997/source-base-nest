import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { MoreThanOrEqual } from 'typeorm';
import { BaseService } from '../../base/base.service';
import { IJwt } from '../authentication/interfaces/jwt.interface';
import { DeviceType } from '../device-types/device-types.const';
import { DEVICE_RELATION, DEVICE_SELECT } from '../devices/devices.const';
import { DevicesService } from '../devices/devices.service';
import { IDevice } from '../devices/interfaces/device.interface';
import { FloorsService } from '../floors/floors.service';
import { IFloor } from '../floors/interfaces/floor.interface';
import {
  UpdateIndicatorModeDto,
  UpdateLightOptimizationModeDto,
} from './dto/body-device-setting.dto';
import {
  UpdateDeviceSettingDto,
  UpdateSensorSettingDto,
} from './dto/update-device-setting.dto';
import { DeviceSetting } from './entities/device-setting.entity';
import { DeviceSettingRepository } from './repositories/device-setting.repository';

@Injectable()
export class DeviceSettingService extends BaseService<
  DeviceSetting,
  DeviceSettingRepository
> {
  constructor(
    @Inject(forwardRef(() => DevicesService))
    private readonly devicesService: DevicesService,
    private readonly floorsService: FloorsService,
    private readonly deviceSettingRepository: DeviceSettingRepository,
  ) {
    super(deviceSettingRepository);
  }

  /**
   * This function update setting of device
   *
   * @Param deviceId: number
   * @Param updateDeviceSettingDto UpdateDeviceSettingDto
   * @returns IDevice
   */
  async updateSetting(
    deviceId: number,
    updateDeviceSettingDto: UpdateDeviceSettingDto,
  ): Promise<IDevice> {
    let device: IDevice = await this.devicesService.findById(deviceId);

    if (!device) {
      throw new HttpException('DEVICES_NOT_FOUND', HttpStatus.BAD_REQUEST);
    }

    if (device?.deviceTypeId !== DeviceType.LightBulb) {
      throw new HttpException('DEVICE_MUST_LIGHT_BULB', HttpStatus.BAD_REQUEST);
    }

    if (device?.deviceSetting) {
      let deviceSettingId = device?.deviceSetting?.id;

      await this.deviceSettingRepository.updateOneAndReturnById(
        deviceSettingId,
        updateDeviceSettingDto,
      );
      device = await this.devicesService.findById(deviceId);
    } else {
      device = await this.devicesService.updateDeviceSetting(
        deviceId,
        updateDeviceSettingDto,
      );
    }

    return device;
  }

  /**
   * This function update indicator mode of device

   * @param address string
   * @param user IJwt
   * @param data UpdateSensorSettingDto
   * @returns IDevice
   */
  public async handleUpdateSettingSensor(
    address: string,
    user: IJwt,
    data: UpdateSensorSettingDto,
  ): Promise<IDevice> {
    let device: IDevice[] = await this.devicesService.find(
      { address: address },
      DEVICE_RELATION,
      DEVICE_SELECT,
    );

    if (device.length <= 0) {
      throw new HttpException('DEVICES_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (device[0].deviceTypeId != DeviceType.SmartSensor) {
      throw new HttpException(
        'DEVICE_NOT_SMART_SENSOR',
        HttpStatus.BAD_REQUEST,
      );
    }

    //check floor exist and check floor with floor of user
    const floorData: IFloor = await this.floorsService.getAndCheckFloor(
      user,
      device[0].floorId,
    );

    for (let sensor of device) {
      if (!sensor.deviceSetting) {
        let dataUpdate = {
          id: sensor.id,
          deviceSetting: data,
        };
        let dataDevice = await this.devicesService.create(dataUpdate);
      } else {
        let deviceSettingId = sensor.deviceSetting.id;

        await this.updateSettingSensor(deviceSettingId, data);
      }
    }

    const result = await this.devicesService.getDetailDeviceByAddress(address);
    return result;
  }

  /**
   * This function update setting sensor

   * @param deviceId number
   * @param updateDeviceSettingDto UpdateSensorSettingDto
   * @returns IDevice
   */
  async updateSettingSensor(
    deviceId: number,
    updateDeviceSettingDto: UpdateSensorSettingDto,
  ): Promise<IDevice> {
    const device = await this.deviceSettingRepository.updateOneAndReturnById(
      deviceId,
      updateDeviceSettingDto,
    );

    return device;
  }

  /**
   * This function update indicator mode of device

   * @param address string
   * @param updateIndicatorModeDto UpdateIndicatorModeDto
   * @returns IDevice
   */
  async updateIndicatorMode(
    address: string,
    updateIndicatorModeDto: UpdateIndicatorModeDto,
  ): Promise<IDevice> {
    let arrayDevice: IDevice[] = await this.devicesService.find(
      {
        address: address,
      },
      DEVICE_RELATION,
      DEVICE_SELECT,
    );

    if (arrayDevice.length <= 0) {
      throw new HttpException('DEVICES_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (arrayDevice[0].deviceTypeId === DeviceType.LightBulb) {
      throw new HttpException(
        'DEVICE_NOT_SMART_SENSOR',
        HttpStatus.BAD_REQUEST,
      );
    }

    for (let device of arrayDevice) {
      if (!device.deviceSetting) {
        let dataUpdate = {
          id: device.id,
          deviceSetting: updateIndicatorModeDto,
        };
        let dataDevice = await this.devicesService.create(dataUpdate);
      } else {
        let deviceSettingId = device.deviceSetting.id;

        await this.deviceSettingRepository.update(
          { id: deviceSettingId },
          updateIndicatorModeDto,
        );
      }
    }

    const result = await this.devicesService.getDetailDeviceByAddress(address);
    return result;
  }

  /**
   * This function update light optimization of device sensor

   * @param address string
   * @param data UpdateLightOptimizationModeDto
   * @returns IDevice
   */
  public async updateLightOptimizationMode(
    address: string,
    data: UpdateLightOptimizationModeDto,
  ): Promise<IDevice> {
    let arrayDevice: IDevice[] = await this.devicesService.find(
      {
        address: address,
      },
      DEVICE_RELATION,
      DEVICE_SELECT,
    );

    // check device registration
    if (arrayDevice.length <= 0) {
      throw new HttpException('DEVICES_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    // check device type smart sensor
    if (arrayDevice[0].deviceTypeId != DeviceType.SmartSensor) {
      throw new HttpException(
        'DEVICE_NOT_SMART_SENSOR',
        HttpStatus.BAD_REQUEST,
      );
    }

    for (let device of arrayDevice) {
      if (!device.deviceSetting) {
        let dataUpdate = {
          id: device.id,
          deviceSetting: data,
        };
        let dataDevice = await this.devicesService.create(dataUpdate);
      } else {
        let deviceSettingId = device.deviceSetting.id;

        await this.deviceSettingRepository.update(
          { id: deviceSettingId },
          data,
        );
      }
    }
    const result = await this.devicesService.getDetailDeviceByAddress(address);
    return result;
  }
}
