import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { DeleteSchedule } from '../entities/delete-schedule.entity';

export class DeleteScheduleRepository extends BaseRepository<DeleteSchedule> {
  constructor(
    @InjectRepository(DeleteSchedule)
    private readonly _repository: Repository<DeleteSchedule>,
  ) {
    super(_repository);
  }
}
