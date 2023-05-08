import {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  SaveOptions
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IBaseRepository<T> {
  checkExists(
    where: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
  ): Promise<boolean>;

  create(dataCr: DeepPartial<T>): Promise<T>;

  save(
    entities: T | DeepPartial<T>[] | any,
    options: SaveOptions,
  ): Promise<T | T[] | any>;

  findOne(
    where: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>[] | any,
    select?: FindOptionsSelect<T> | any,
    order?: FindOptionsOrder<T> | any,
  ): Promise<T>;

  find(
    where: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>[] | any,
    select?: FindOptionsSelect<T> | any,
    order?: FindOptionsOrder<T>,
  ): Promise<T[]>;

  update(
    where: FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
  ): Promise<void>;

  updateOneAndReturnById(
    id: number,
    data: QueryDeepPartialEntity<T>,
    relations?: FindOptionsRelations<T>[] | any,
    select?: FindOptionsSelect<T> | any,
  ): Promise<T>;

  findAndCount(
    where: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>[] | any,
    select?: FindOptionsSelect<T> | any,
    take?: number,
    skip?: number,
    order?: FindOptionsOrder<T>,
  ): Promise<[T[], number]>;
  delete(where: FindOptionsWhere<T>): Promise<void>;

  softDelete(where: FindOptionsWhere<T>): Promise<void>;

  restore(where: FindOptionsWhere<T>): Promise<void>;

  softRemove(
    id: number,
    relations?: FindOptionsRelations<T>,
    options?: SaveOptions,
  ): Promise<void>;

  findOneByOrFail(
    id: number,
    relations?: FindOptionsRelations<T>[] | any,
  ): Promise<T>;

  recover(
    id: number,
    relations?: FindOptionsRelations<T>,
    options?: SaveOptions,
  ): Promise<void>;

  findOneByOrFail(
    id: number,
    relations?: FindOptionsRelations<T>[] | any,
  ): Promise<T>;

  insert(data: QueryDeepPartialEntity<T>[]): Promise<T>;
}
