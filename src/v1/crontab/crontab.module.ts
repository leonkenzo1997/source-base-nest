import { Module } from '@nestjs/common';
import { CrontabController } from './crontab.controller';
import { CrontabService } from './crontab.service';

@Module({
  controllers: [CrontabController],
  providers: [CrontabService],
  exports: [CrontabService],
})
export class CrontabModule {}