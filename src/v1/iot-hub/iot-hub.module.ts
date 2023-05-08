import { Module } from '@nestjs/common';
import { IotHubService } from './iot-hub.service';
import { IotHubController } from './iot-hub.controller';

@Module({
  controllers: [IotHubController],
  providers: [IotHubService]
})
export class IotHubModule {}
