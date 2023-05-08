import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { SceneSetting } from '../entities/scene-setting.entity'; 

export class SceneSettingRepository extends BaseRepository<SceneSetting> {
  constructor(
    @InjectRepository(SceneSetting) private readonly _repository: Repository<SceneSetting>,
  ) {
    super(_repository);
  }
}
