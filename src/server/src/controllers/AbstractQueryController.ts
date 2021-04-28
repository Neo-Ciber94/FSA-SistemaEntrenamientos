import { Get, QueryParam, Param } from 'routing-controllers';
import { Repository } from 'typeorm';
import { Entity } from '../types/Entity';

export abstract class AbstractQueryController<T extends Entity<T>> {
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
}
