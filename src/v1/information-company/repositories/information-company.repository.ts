import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { InformationCompany } from '../entities/information-company.entity';

export class InformationCompanyRepository extends BaseRepository<InformationCompany> {
  constructor(
    @InjectRepository(InformationCompany)
    private readonly _repository: Repository<InformationCompany>,
  ) {
    super(_repository);
  }
}
