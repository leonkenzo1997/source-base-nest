/* eslint-disable prettier/prettier */
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { Ota } from '../entities/ota.entity';

export class OtasRepository extends BaseRepository<Ota> {
  constructor(
    @InjectRepository(Ota)
    private readonly _repository: Repository<Ota>,
  ) {
    super(_repository);
  }

  /**
   * this method is find new version ota of device
   *
   * @param deviceId number
   * @returns any
   */
  public async findNewVersion(deviceId: number): Promise<any> {
    const query = Ota.createQueryBuilder('ota').innerJoin(
      'ota.deviceType',
      'DeviceType',
    );
    const ota = await query
      .select('ota.createdAt', 'createdAt') // change column if change condition
      .addSelect('ota.id', 'otaId')
      .addSelect('DeviceType.id', 'deviceTypeId')
      .addSelect('DeviceType.type', 'type')
      .addSelect('ota.version', 'newVersion')
      .where(`ota.deviceType = ${deviceId}`)
      .orderBy('ota.createdAt', 'DESC')
      .limit(1)
      .execute();
    return ota;
  }
}
