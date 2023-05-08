import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { DevicesEntity } from '../entities/device.entity';

export class DevicesRepository extends BaseRepository<DevicesEntity> {
  constructor(
    @InjectRepository(DevicesEntity)
    private readonly _repository: Repository<DevicesEntity>,
  ) {
    super(_repository);
  }
}
