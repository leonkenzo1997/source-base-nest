import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Session, SessionStatus } from './entities/session.entity';
import { SessionsRepository } from './repositories/session.repository';
import { IUser } from '../users/interfaces/user.interface';

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  /**
   * This function is find session have status activity
   *
   * @param id number
   * @returns Session
   */
  async findActiveSessionById(id: number): Promise<Session> {
    let where = {
      id: id,
      status: SessionStatus.Active,
    };
    if (!id) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
    const result = await this.sessionsRepository.findOne(where);
    return result;
  }

  /**
   * This function is create session
   *
   * @param user User
   * @returns Session
   */
  async createSession(user: User |IUser): Promise<Session> {
    const result = await this.sessionsRepository.save({ user });
    return result;
  }

  /**
   * This function is find session have status deactivce
   *
   * @param id number
   * @returns void
   */
  async disableActiveSessionById(id: number): Promise<void> {
    return await this.sessionsRepository.update(
      { id: id, status: SessionStatus.Active },
      { status: SessionStatus.Deactivated },
    );
  }
}
