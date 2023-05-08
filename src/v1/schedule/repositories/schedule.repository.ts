import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { Schedule } from '../entities/schedule.entity';

export class ScheduleRepository extends BaseRepository<Schedule> {
  constructor(
    @InjectRepository(Schedule)
    private readonly _repository: Repository<Schedule>,
  ) {
    super(_repository);
  }
}
