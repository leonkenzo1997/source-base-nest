import {
  BaseEntity,
  DeepPartial,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  SaveOptions
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IBaseService } from './base-service.interface';
import { BaseRepository } from './base.repository';

export class BaseService<T extends BaseEntity, R extends BaseRepository<T>>
  implements IBaseService<T>
{
  protected readonly repository: R;

  constructor(repository: R) {
    this.repository = repository;
  }

  async findOne(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
    select?: FindOptionsSelect<T> | any,
  ): Promise<T> {
    return this.repository.findOne(where, relations, select);
  }

  async findOneAndCreate(
    where: FindOptionsWhere<T>,
    data: DeepPartial<T>,
  ): Promise<T> {
    const record = await this.repository.findOne(where);
    if (record) return record;
    return this.repository.create(data);
  }

  async find(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
    select?: FindOptionsSelect<T> | any,
  ): Promise<T[]> {
    return this.repository.find(where, relations, select);
  }

  async findAndCount(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    relations?: any,
    select?: any,
    take?: number,
    skip?: number,
    order?: FindOptionsOrder<T>,
  ): Promise<[T[], number]> {
    return this.repository.findAndCount(
      where,
      relations,
      select,
      take,
      skip,
      order,
    );
  }

  async findOneByOrFail(id: number): Promise<T> {
    return this.repository.findOneByOrFail(id);
  }

  async create(dataCr: DeepPartial<T>): Promise<T> {
    return this.repository.create(dataCr);
  }

  async save(entities: any, options?: SaveOptions): Promise<any> {
    return this.repository.save(entities, options);
  }

  async updateOneById(
    id: number,
    data: QueryDeepPartialEntity<T>,
  ): Promise<void> {
    await this.repository.updateOneById(id, data);
  }

  async update(
    where: FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
  ): Promise<void> {
    await this.repository.update(where, data);
  }

  async softRemove(
    id: number,
    relations?: FindOptionsRelations<T>,
    options?: SaveOptions,
  ): Promise<void> {
    await this.repository.softRemove(id, relations, options);
  }
}