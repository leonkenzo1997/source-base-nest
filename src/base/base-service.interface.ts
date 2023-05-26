import {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  SaveOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IBaseService<T> {
  findOne(where: FindOptionsWhere<T>): Promise<T>;
  findOneAndCreate(
    where: FindOptionsWhere<T>,
    data: DeepPartial<T>,
  ): Promise<T>;
  findOneByOrFail(id: number): Promise<T>;
  find(where: FindOptionsWhere<T>): Promise<T[]>;
  findAndCount(
    where: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>[] | any,
    select?: FindOptionsSelect<T> | any,
    take?: number,
    skip?: number,
    order?: FindOptionsOrder<T>,
  ): Promise<[T[], number]>;
  create(dataCr: DeepPartial<T>): Promise<T>;
  save(
    entities: T | DeepPartial<T>[] | any,
    options: SaveOptions,
  ): Promise<any>;
  updateOneById(id: number, data: QueryDeepPartialEntity<T>): Promise<void>;
  update(
    where: FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
  ): Promise<void>;
}
