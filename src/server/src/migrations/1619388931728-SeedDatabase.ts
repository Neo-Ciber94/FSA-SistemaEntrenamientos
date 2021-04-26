import { MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '../entities/Rol';
import { RoleName } from '../types/RoleName';

export class SeedDatabase1619388931728 implements MigrationInterface {
  public async up(_: QueryRunner): Promise<void> {
    const roles = Role.create([
      { name: RoleName.Student },
      { name: RoleName.Teacher },
      { name: RoleName.Admin },
    ]);

    await Role.save(roles);
  }

  public async down(_: QueryRunner): Promise<void> {}
}
