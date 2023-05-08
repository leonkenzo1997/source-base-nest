import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { UserBuilding } from '../entities/user-building.entity';

export class UserBuildingRepository extends BaseRepository<UserBuilding> {
  constructor(
    @InjectRepository(UserBuilding)
    private readonly _repository: Repository<UserBuilding>,
  ) {
    super(_repository);
  }
}
