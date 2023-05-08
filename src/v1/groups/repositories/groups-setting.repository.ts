import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { GroupSetting } from '../entities/group-setting.entity';
import { Group } from '../entities/group.entity';

export class GroupsSettingRepository extends BaseRepository<GroupSetting> {
  constructor(
    @InjectRepository(GroupSetting)
    private readonly _repository: Repository<GroupSetting>,
  ) {
    super(_repository);
  }
}
