import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { UserBuildingFloor } from '../entities/user-building-floor.entity';

export class UserBuildingFloorRepository extends BaseRepository<UserBuildingFloor> {
  constructor(
    @InjectRepository(UserBuildingFloor)
    private readonly _repository: Repository<UserBuildingFloor>,
  ) {
    super(_repository);
  }

  async getAllUserAndFloorByBuildingId(buildingId) {
    const result = this._repository.createQueryBuilder()
    .where({building: {id: buildingId}})
    .distinct()
    .getMany();
    return result;
  }
}
