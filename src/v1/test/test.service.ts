import { Injectable } from '@nestjs/common';
import { CronService } from '../../cron/cron.service';
import { CrontabService } from '../crontab/crontab.service';

@Injectable()
export class TestService {
  constructor(
    private crontabService: CrontabService,
    private cronService: CronService,
  ) {}

  async testSchedule() {
    let name = 'test-cron';
    let time = 5;
    await this.crontabService.addCronJob(name, time);
    // await this.cronService.addCronJob(name, time);
  }
}
