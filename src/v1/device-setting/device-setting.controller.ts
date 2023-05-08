import { Body, Controller, Param, Put, Request } from '@nestjs/common';
import { AttachDeviceIdDto } from '../../dto/params.dto';
import { IRequest } from '../../interfaces/request.interface';
import {
  IErrorResponse,
  ISuccessResponse
} from '../../interfaces/response.interface';
import { ResponseService } from '../../utils/response.service';
import { AuthRoles } from '../roles/decorator/roles.decorator';
import { UserRole } from '../users/user.const';
import { DeviceSettingService } from './device-setting.service';
import {
  UpdateIndicatorModeDto,
  UpdateLightOptimizationModeDto
} from './dto/body-device-setting.dto';
import { ParamsAddressDto } from './dto/params-device-setting.dto';
import {
  UpdateDeviceSettingDto,
  UpdateSensorSettingDto
} from './dto/update-device-setting.dto';

@Controller()
export class DeviceSettingController {
  constructor(
    private readonly deviceSettingService: DeviceSettingService,
    private res: ResponseService,
  ) {}

  /**
   * This function update setting of device
   *
   * @Param params: AttachDeviceIdDto
   * @Body updateDeviceSettingDto UpdateDeviceSettingDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put(':deviceId')
  async updateSetting(
    @Param() params: AttachDeviceIdDto,
    @Body() updateDeviceSettingDto: UpdateDeviceSettingDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const deviceId = params.deviceId;
    let data = await this.deviceSettingService.updateSetting(
      deviceId,
      updateDeviceSettingDto,
    );

    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This function update setting of device sensor
   *
   * @Request req: IRequest
   * @Param params: ParamsAddressDto
   * @Body updateSensorSettingDto UpdateSensorSettingDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put('/detection-mode/:address')
  public async updateSettingSensor(
    @Request() req: IRequest,
    @Param() params: ParamsAddressDto,
    @Body() updateSensorSettingDto: UpdateSensorSettingDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const address = params.address;
    // let data = await this.devicesService.updateSettingSensor(
    //   address,
    //   user,
    //   updateSensorSettingDto,
    // );
    let data = await this.deviceSettingService.handleUpdateSettingSensor(
      address,
      user,
      updateSensorSettingDto,
    );

    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This function update indicator of device
   *
   * @Request req: IRequest
   * @Param params: ParamsAddressDto
   * @Body updateIndicatorModeDto UpdateIndicatorModeDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put('/indicator-mode/:address')
  public async updateIndicatorMode(
    @Request() req: IRequest,
    @Param() params: ParamsAddressDto,
    @Body() updateIndicatorModeDto: UpdateIndicatorModeDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const address = params.address;
    let data = await this.deviceSettingService.updateIndicatorMode(
      address,
      updateIndicatorModeDto,
    );

    return this.res.success(data, 'SUCCESS');
  }

  /**
   * This function update  optimization of device
   *
   * @Request req: IRequest
   * @Param params: ParamsAddressDto
   * @Body updateLightOptimizationModeDto UpdateLightOptimizationModeDto
   * @returns ISuccessResponse | IErrorResponse
   */
  @AuthRoles(UserRole.Admin)
  @Put('/optimization-mode/:address')
  public async updateLightMode(
    @Request() req: IRequest,
    @Param() params: ParamsAddressDto,
    @Body() updateLightOptimizationModeDto: UpdateLightOptimizationModeDto,
  ): Promise<ISuccessResponse | IErrorResponse> {
    const user = req.user;
    const address = params.address;
    let data = await this.deviceSettingService.updateLightOptimizationMode(
      address,
      updateLightOptimizationModeDto,
    );

    return this.res.success(data, 'SUCCESS');
  }
}
