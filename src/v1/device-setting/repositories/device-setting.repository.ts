import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { DeviceSetting } from '../entities/device-setting.entity';

export class DeviceSettingRepository extends BaseRepository<DeviceSetting> {
  constructor(
    @InjectRepository(DeviceSetting)
    private readonly _repository: Repository<DeviceSetting>,
  ) {
    super(_repository);
  }
}
