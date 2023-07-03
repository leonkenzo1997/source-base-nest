import {
  BaseEntity,
  DeepPartial,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  SaveOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IBaseService } from './base-service.interface';
import { BaseRepository } from './base.repository';

// export class BaseService<T extends BaseEntity, R extends BaseRepository<T>>
export class BaseService<T extends BaseEntity> implements IBaseService<T> {
  // protected readonly repository: R;

  // constructor(repository: R) {
  //   this.repository = repository;
  // }

  constructor(private readonly _repository: BaseRepository<T>) {
    this._repository = _repository;
  }

  async findOne(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
    select?: FindOptionsSelect<T> | any,
  ): Promise<T> {
    return this._repository.findOne(where, relations, select);
  }

  async findOneAndCreate(
    where: FindOptionsWhere<T>,
    data: DeepPartial<T>,
  ): Promise<T> {
    const record = await this._repository.findOne(where);
    if (record) return record;
    return this._repository.create(data);
  }

  async find(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
    select?: FindOptionsSelect<T> | any,
  ): Promise<T[]> {
    return this._repository.find(where, relations, select);
  }

  async findAndCount(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    relations?: any,
    select?: any,
    take?: number,
    skip?: number,
    order?: FindOptionsOrder<T>,
  ): Promise<[T[], number]> {
    return this._repository.findAndCount(
      where,
      relations,
      select,
      take,
      skip,
      order,
    );
  }

  async findOneByOrFail(id: number): Promise<T> {
    return this._repository.findOneByOrFail(id);
  }

  async create(dataCr: DeepPartial<T>): Promise<T> {
    return this._repository.create(dataCr);
  }

  async save(entities: any, options?: SaveOptions): Promise<any> {
    return this._repository.save(entities, options);
  }

  async updateOneById(
    id: number,
    data: QueryDeepPartialEntity<T>,
  ): Promise<void> {
    await this._repository.updateOneById(id, data);
  }

  async update(
    where: FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
  ): Promise<void> {
    await this._repository.update(where, data);
  }

  async softRemove(
    id: number,
    relations?: FindOptionsRelations<T>,
    options?: SaveOptions,
  ): Promise<void> {
    await this._repository.softRemove(id, relations, options);
  }
}
