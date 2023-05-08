import {
  BaseEntity,
  DeepPartial,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  ObjectID,
  Repository,
  SaveOptions
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IBaseRepository } from './base-repository.interface';

export class BaseRepository<T extends BaseEntity>
  implements IBaseRepository<T>
{
  constructor(private readonly repository: Repository<T>) {}

  async checkExists(
    where: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
  ): Promise<boolean> {
    const isBoolean = await this.repository.findOne({ where });
    return isBoolean ? true : false;
  }

  async findOne(
    where: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
    select?: FindOptionsSelect<T> | any,
    order?: FindOptionsOrder<T> | any,
  ): Promise<T> {
    return this.repository.findOne({ where, relations, select, order });
  }

  async find(
    where: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
    select?: FindOptionsSelect<T> | any,
    order?: FindOptionsOrder<T> | any,
  ): Promise<T[]> {
    return this.repository.find({ where, relations, select, order });
  }

  async create(dataCreate: DeepPartial<T>): Promise<T> {
    const result: T = this.repository.create(dataCreate);
    await this.repository.save(result);
    return result;
  }

  async save(
    entities: T | DeepPartial<T>[] | any,
    options?: SaveOptions,
  ): Promise<T | T[] | any> {
    return await this.repository.save(entities, options);
  }

  async updateOneAndReturnById(
    id: number,
    data: QueryDeepPartialEntity<T>,
    relations?: FindOptionsRelations<T>,
    select?: FindOptionsSelect<T> | any,
  ): Promise<T> {
    await this.repository.update(id, data);
    const where: FindOptionsWhere<T> | any = { id };
    return this.repository.findOne({ where, relations, select });
  }

  async update(
    where: FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
  ): Promise<void> {
    await this.repository.update(where, data);
  }

  async findAndCount(
    where: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
    select?: FindOptionsSelect<T> | any,
    take?: number,
    skip?: number,
    order?: FindOptionsOrder<T> | any,
  ): Promise<[T[], number]> {
    return this.repository.findAndCount({
      where,
      relations,
      select,
      take,
      skip,
      order,
    });
  }

  async count(
    where: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
  ): Promise<number> {
    return this.repository.count({ where });
  }

  async findOneByOrFail(id: number) {
    const where: FindOptionsWhere<T> | any = { id };
    return this.repository.findOneByOrFail(where);
  }

  async delete(where: FindOptionsWhere<T>): Promise<void> {
    await this.repository.delete(where);
  }

  async softDelete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectID
      | ObjectID[]
      | FindOptionsWhere<T>,
  ): Promise<void> {
    await this.repository.softDelete(criteria);
  }

  async restore(where: FindOptionsWhere<T>): Promise<void> {
    await this.repository.restore(where);
  }

  async recover(
    id: number,
    relations?: FindOptionsRelations<T>,
    options?: SaveOptions,
  ): Promise<void> {
    const where: FindOptionsWhere<T> | any = { id };
    const entity = await this.repository.findOne({ where, relations });
    await entity.recover(options);
  }

  async softRemove(
    id: number,
    relations?: FindOptionsRelations<T>,
    options?: SaveOptions,
  ): Promise<void> {
    const where: FindOptionsWhere<T> | any = { id };
    const entity = await this.repository.findOne({ where, relations });
    await entity.softRemove(options);
  }

  async insert(data: QueryDeepPartialEntity<T>[]): Promise<T> {
    let result: any = await this.repository.insert(data);
    return result;
  }

  async updateOneById(
    id: number,
    data: QueryDeepPartialEntity<T>,
  ): Promise<void> {
    await this.repository.update(id, data);
  }
}
