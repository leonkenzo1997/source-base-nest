import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { UserRule } from '../entities/user-rule.entity';

export class UsersRulesRepository extends BaseRepository<UserRule> {
  constructor(
    @InjectRepository(UserRule) private readonly _repository: Repository<UserRule>,
  ) {
    super(_repository);
  }
}
