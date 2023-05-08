import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { Rule } from '../entities/rule.entity';

export class RuleRepository extends BaseRepository<Rule> {
  constructor(
    @InjectRepository(Rule) private readonly _repository: Repository<Rule>,
  ) {
    super(_repository);
  }
}
