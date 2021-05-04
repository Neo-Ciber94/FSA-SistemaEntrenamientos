import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  QueryParam,
  Res,
} from 'routing-controllers';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { Entity } from '../types/Entity';

export abstract class AbstractBaseController<T extends Entity<T>> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly allowedIncludes: string[]
  ) {
    Object.freeze(allowedIncludes);
  }

  @Get()
  getAll(
    @Res() response: Response,
    @QueryParam('include') include?: string
  ): Response | Promise<T[]> {
    const relations = include ? include.split(',') : [];

    if (!this.isValidIncludes(relations)) {
      return this.sendStatusInvalidIncludes400(response, relations);
    }

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

  protected isValidIncludes(includes: string[]) {
    for (const s of includes) {
      if (!this.allowedIncludes.includes(s)) {
        return false;
      }
    }

    return true;
  }

  protected sendStatusInvalidIncludes400(
    response: Response,
    includes: string[]
  ) {
    console.assert(includes.length > 0);

    let message: string;

    if (includes.length === 1) {
      message = `Invalid includes, expected: '${includes[0]}'`;
    } else {
      message = `Invalid includes, expected one of '${includes.toString()}'`;
    }

    return response.status(400).send(message);
  }
}
