import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import {  FloorEntity } from '../entities/floor.entity';

export class FloorsRepository extends BaseRepository<FloorEntity> {
  constructor(
    @InjectRepository(FloorEntity) private readonly _repository: Repository<FloorEntity>,
  ) {
    super(_repository);
  }
}
