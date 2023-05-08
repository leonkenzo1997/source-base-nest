import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { User } from '../entities/user.entity';

export class UsersRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User) private readonly _repository: Repository<User>,
  ) {
    super(_repository);
  }

  // async findEmailAndRole(){
  //   this._repository.createQueryBuilder().leftJoin()
  // }
}
