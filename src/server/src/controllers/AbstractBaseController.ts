import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  QueryParam,
} from 'routing-controllers';
import { DeepPartial, Repository } from 'typeorm';

type Entity<T> = { id: number } & DeepPartial<T>;

export abstract class AbstractBaseController<T extends Entity<T>> {
  constructor(protected readonly repository: Repository<T>) {}

  @Get()
  getAll(@QueryParam('include') include?: string): Promise<T[]> {
    const relations = include ? include.split(',') : [];
    return this.repository.find({ relations });
  }

  @Get('/:id')
  getById(
    @Param('id') id: number,
    @QueryParam('include') include?: string
  ): Promise<T | undefined> {
    const relations = include ? include.split(',') : [];
    return this.repository.findOne(id, { relations });
  }

  @Post()
  create(@Body() entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  @Put()
  async update(
    @Body() entity: T,
    @QueryParam('include') include?: string
  ): Promise<T | undefined> {
    const relations = include ? include.split(',') : [];
    const entityToUpdate = await this.repository.findOne(entity.id, {
      relations,
    });

    if (entityToUpdate == null || entity.id != entityToUpdate.id) {
      return undefined;
    }

    return this.repository.save(entity);
  }

  @Delete('/:id')
  async delete(
    @Param('id') id: number,
    @QueryParam('include') include?: string
  ): Promise<T | undefined> {
    const relations = include ? include.split(',') : [];
    const entityToDelete = await this.repository.findOne(id, {
      relations,
    });
    const deleteResult = await this.repository.delete(id);

    if (deleteResult.affected && deleteResult.affected > 0 && entityToDelete) {
      return entityToDelete;
    }
  }
}
