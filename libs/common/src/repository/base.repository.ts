import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  EntityTarget,
  UpdateResult,
  DataSource,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Logger } from '@nestjs/common';

type EntityId = string | number;

export interface IRepository<T, ID> {
  create(data: DeepPartial<T>): T;
  createMany(data: DeepPartial<T>[]): T[];
  save(data: DeepPartial<T>): Promise<T>;
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;
  findOneById(id: ID): Promise<T | null>;
  findByCondition(filterCondition: FindOneOptions<T>): Promise<T | null>;
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  remove(data: T): Promise<T>;
  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>;
  preload(entityLike: DeepPartial<T>): Promise<T | null>;
  update(id: ID, data: QueryDeepPartialEntity<T>): Promise<UpdateResult>;
  paginate(
    options: FindManyOptions<T>,
    page: number,
    limit: number,
  ): Promise<{ data: T[]; total: number; page: number; limit: number }>;
}

export abstract class BaseRepository<T extends { id: EntityId }, ID = EntityId>
  implements IRepository<T, ID>
{
  protected readonly repository: Repository<T>;
  protected readonly logger = new Logger(BaseRepository.name);

  constructor(
    protected readonly dataSource: DataSource,
    entity: EntityTarget<T>,
  ) {
    this.repository = this.dataSource.getRepository(entity);

    if (!this.dataSource.isInitialized) {
      this.logger.error('Database connection is not initialized');
      throw new Error('Database connection is not initialized');
    }
  }

  public create(data: DeepPartial<T>): T {
    return this.repository.create(data);
  }

  public createMany(data: DeepPartial<T>[]): T[] {
    return this.repository.create(data);
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    try {
      return await this.repository.save(data);
    } catch (error) {
      this.logger.error('Error in save()', error.stack);
      throw error;
    }
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    try {
      return await this.repository.save(data);
    } catch (error) {
      this.logger.error('Error in saveMany()', error.stack);
      throw error;
    }
  }

  public async findOneById(id: ID): Promise<T | null> {
    try {
      return await this.repository.findOneBy({ id } as FindOptionsWhere<T>);
    } catch (error) {
      this.logger.error(`Error in findOneById(${id})`, error.stack);
      return null;
    }
  }

  public async findByCondition(
    filterCondition: FindOneOptions<T>,
  ): Promise<T | null> {
    try {
      return await this.repository.findOne(filterCondition);
    } catch (error) {
      this.logger.error('Error in findByCondition()', error.stack);
      return null;
    }
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    try {
      return await this.repository.find(options);
    } catch (error) {
      this.logger.error('Error in findAll()', error.stack);
      return [];
    }
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    try {
      return await this.repository.find(relations);
    } catch (error) {
      this.logger.error('Error in findWithRelations()', error.stack);
      return [];
    }
  }

  public async remove(data: T): Promise<T> {
    try {
      return await this.repository.remove(data);
    } catch (error) {
      this.logger.error('Error in remove()', error.stack);
      throw error;
    }
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T | null> {
    try {
      return (await this.repository.preload(entityLike)) || null;
    } catch (error) {
      this.logger.error('Error in preload()', error.stack);
      return null;
    }
  }

  public async update(
    id: ID,
    data: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    try {
      return await this.repository.update(id, data);
    } catch (error) {
      this.logger.error(`Error in update(${id})`, error.stack);
      throw error;
    }
  }

  public async paginate(
    options: FindManyOptions<T>,
    page = 1,
    limit = 10,
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    try {
      const [data, total] = await this.repository.findAndCount({
        ...options,
        skip: (page - 1) * limit,
        take: limit,
      });
      return { data, total, page, limit };
    } catch (error) {
      this.logger.error('Error in paginate()', error.stack);
      throw error;
    }
  }
}
