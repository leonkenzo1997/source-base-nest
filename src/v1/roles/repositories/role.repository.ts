import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { Role } from '../entities/role.entity';

export class RoleRepository extends BaseRepository<Role> {
  constructor(
    @InjectRepository(Role) private readonly _repository: Repository<Role>,
  ) {
    super(_repository);
  }
}
