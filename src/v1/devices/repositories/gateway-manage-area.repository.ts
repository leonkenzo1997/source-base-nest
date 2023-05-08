import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { GatewayManageAreaEntity } from '../entities/gateway-manage-area.entity';

export class GatewayManageAreaRepository extends BaseRepository<GatewayManageAreaEntity> {
  constructor(
    @InjectRepository(GatewayManageAreaEntity)
    private readonly _repository: Repository<GatewayManageAreaEntity>,
  ) {
    super(_repository);
  }
}
