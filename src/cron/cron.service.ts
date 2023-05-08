import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  // private readonly logger = new Logger(CronService.name);
  // constructor(private readonly httpService: HttpService) {}

  // @Cron('*/30 * * * * *')
  // async handleCron() {
  //   this.logger.debug('Called when the current second is 45');
  //   const checkResultObservable = this.httpService.get(
  //     'http://localhost:3000/api/v1/health-check/health-check',
  //   );
  //   const checkResult = await (await lastValueFrom(checkResultObservable)).data;
  //   this.logger.debug(JSON.stringify(checkResult));
  // }
}
