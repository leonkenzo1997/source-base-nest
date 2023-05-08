/* eslint-disable prettier/prettier */
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { Building } from '../entities/building.entity';

export class BuildingRepository extends BaseRepository<Building> {
  constructor(
    @InjectRepository(Building)
    private readonly _repository: Repository<Building>,
  ) {
    super(_repository);
  }

}
