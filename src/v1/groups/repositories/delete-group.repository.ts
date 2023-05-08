import { DeleteGroup } from './../entities/delete-group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';

export class DeleteGroupsRepository extends BaseRepository<DeleteGroup> {
  constructor(
    @InjectRepository(DeleteGroup)
    private readonly _repository: Repository<DeleteGroup>,
  ) {
    super(_repository);
  }
}
