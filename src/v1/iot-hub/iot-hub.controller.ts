import {
  Controller, Param, Post
} from '@nestjs/common';
import { IotHubService } from './iot-hub.service';

import { ParamDeviceDto } from './dto/params-device.dto';

@Controller()
export class IotHubController {
  constructor(private readonly iotHubService: IotHubService) {}
  @Post('connect/:deviceId')
  public async connectIot(@Param() param: ParamDeviceDto) {
    const results = await this.iotHubService.connectIotHub(param.deviceId);
    return results;
  }
}
