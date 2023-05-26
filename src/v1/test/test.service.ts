import { Injectable } from '@nestjs/common';
import { SessionsService } from './../sessions/sessions.service';
import { Session } from '../sessions/entities/session.entity';


@Injectable()
export class TestService {
  constructor(private readonly sessionsService: SessionsService) {}

  async test(id: number): Promise<Session> {
    const result = await this.sessionsService.findActiveSessionById(id);
    return result;
  }
}
