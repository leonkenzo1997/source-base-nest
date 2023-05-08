import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { ZoneEntity } from '../entities/zone.entity';

export class ZonesRepository extends BaseRepository<ZoneEntity> {
  constructor(
    @InjectRepository(ZoneEntity)
    private readonly _repository: Repository<ZoneEntity>,
  ) {
    super(_repository);
  }
}
