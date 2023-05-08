import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { DeleteZone } from '../entities/delete-zone.entity';

export class DeleteZonesRepository extends BaseRepository<DeleteZone> {
  constructor(
    @InjectRepository(DeleteZone)
    private readonly _repository: Repository<DeleteZone>,
  ) {
    super(_repository);
  }
}
