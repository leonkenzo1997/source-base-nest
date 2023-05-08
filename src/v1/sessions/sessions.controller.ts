import { Controller } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller()
// @UseGuards(RolesGuard)
// @UseInterceptors(InstanceToJsonInterceptor)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}
}
