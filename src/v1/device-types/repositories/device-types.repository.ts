import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { DeviceType } from '../entities/device-type.entity';

export class DeviceTypesRepository extends BaseRepository<DeviceType> {
  constructor(
    @InjectRepository(DeviceType)
    private readonly _repository: Repository<DeviceType>,
  ) {
    super(_repository);
  }
}
