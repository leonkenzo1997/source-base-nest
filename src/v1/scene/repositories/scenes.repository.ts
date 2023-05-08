import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { Scene } from '../entities/scene.entity';

export class ScenesRepository extends BaseRepository<Scene> {
  constructor(
    @InjectRepository(Scene) private readonly _repository: Repository<Scene>,
  ) {
    super(_repository);
  }
}
