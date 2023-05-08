import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { DeleteDevices } from '../entities/delete-device.entity';

export class DeleteDevicesRepository extends BaseRepository<DeleteDevices> {
  constructor(
    @InjectRepository(DeleteDevices)
    private readonly _repository: Repository<DeleteDevices>,
  ) {
    super(_repository);
  }
}
