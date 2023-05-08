import { Controller } from '@nestjs/common';
import { CrontabService } from './crontab.service';

@Controller()
export class CrontabController {
  constructor(private readonly crontabService: CrontabService) {}
}
