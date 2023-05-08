import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { Session } from '../entities/session.entity';

export class SessionsRepository extends BaseRepository<Session> {
  constructor(
    @InjectRepository(Session)
    private readonly _repository: Repository<Session>,
  ) {
    super(_repository);
  }

  //   async FindActiveSessionById(id:number) : Promise<Session> {
  //     const result = await this._repository.findOne("");
  //     return result;
  //   }
}
