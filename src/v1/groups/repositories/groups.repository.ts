import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { Group } from '../entities/group.entity';

export class GroupsRepository extends BaseRepository<Group> {
  constructor(
    @InjectRepository(Group) private readonly _repository: Repository<Group>,
  ) {
    super(_repository);
  }
}
