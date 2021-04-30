import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../entities';
import { Role } from '../entities/Role';
import { RoleName } from '../types/RoleName';

export class SeedDatabase1619388931728 implements MigrationInterface {
  public async up(_: QueryRunner): Promise<void> {
    await Role.save(getDefaultRoles());
    await User.save(await getDefaultUsers());
  }

  public async down(_: QueryRunner): Promise<void> {}
}

function getDefaultRoles() {
  return Role.create([
    { name: RoleName.Student },
    { name: RoleName.Teacher },
    { name: RoleName.Admin },
  ]);
}

// FIXME: Move default user credentials to other place
async function getDefaultUsers() {
  const admin = await User.createWithRole({
    firstName: 'Admin',
    lastName: 'Admin',
    email: 'admin@admin.com',
    password: '123456',
    roleName: RoleName.Admin,
  });

  return [admin];
}
