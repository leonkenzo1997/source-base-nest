import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { DeleteScene } from '../entities/delete-scene.entity';

export class DeleteScenesRepository extends BaseRepository<DeleteScene> {
  constructor(
    @InjectRepository(DeleteScene)
    private readonly _repository: Repository<DeleteScene>,
  ) {
    super(_repository);
  }
}
