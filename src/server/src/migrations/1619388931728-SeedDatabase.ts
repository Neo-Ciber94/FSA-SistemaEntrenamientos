import { MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '../entities/Rol';

export class SeedDatabase1619388931728 implements MigrationInterface {
  public async up(_: QueryRunner): Promise<void> {
    const roles = Role.create([
      { name: 'student' },
      { name: 'teacher' },
      { name: 'admin' },
    ]);

    await Role.save(roles);
  }

  public async down(_: QueryRunner): Promise<void> {}
}
