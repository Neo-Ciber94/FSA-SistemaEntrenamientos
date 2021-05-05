import { Repository } from 'typeorm';

export function loadRelationsAndQuery<T>(
  repository: Repository<T>,
  alias: string,
  relations: string[]
) {
  let query = repository.createQueryBuilder(alias);

  for (const relation of relations) {
    // entity.name, name
    query = query.leftJoinAndSelect(`${alias}.${relation}`, relation);
  }

  return query;
}
