import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from 'routing-controllers';
import { DeepPartial, Repository } from 'typeorm';
import { Role } from '../entities/Rol';

type Entity<T> = { id: number } & DeepPartial<T>;

export class AbstractBaseController<T extends Entity<T>> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly relations: string[] = []
  ) {}

  @Get()
  getAll(): Promise<T[]> {
    return this.repository.find({ relations: this.relations });
  }

  @Get('/:id')
  getById(@Param('id') id: number): Promise<T | undefined> {
    return this.repository.findOne(id, { relations: this.relations });
  }

  @Post()
  create(@Body() entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  @Put()
  async update(@Body() entity: T): Promise<T | undefined> {
    const entityToUpdate = this.repository.findOne(entity.id, {
      relations: this.relations,
    });
    if (entityToUpdate == null) {
      return undefined;
    }

    return this.repository.save(entity);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<T | undefined> {
    const entityToDelete = await this.repository.findOne(id, {
      relations: this.relations,
    });
    const deleteResult = await this.repository.delete(id);

    if (deleteResult.affected && deleteResult.affected > 0 && entityToDelete) {
      return entityToDelete;
    } else {
      return undefined;
    }
  }
}

@Controller('/api/roles')
export class RoleController extends AbstractBaseController<Role> {
  constructor() {
    super(Role.getRepository());
  }
}
