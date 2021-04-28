import { DeepPartial } from 'typeorm';

export type Entity<T> = { id: number } & DeepPartial<T>;
