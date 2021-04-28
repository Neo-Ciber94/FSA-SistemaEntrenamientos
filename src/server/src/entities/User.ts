import {
  BaseEntity,
  Column,
  Entity,
  FindOneOptions,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NewUser, RoleName, UserDTO } from '../types';
import { encryptPassword } from '../utils';
import { Role } from './Rol';

@Entity()
@Index('idx_token', ['refreshToken'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  hash!: string;

  @Column()
  salt!: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  refreshToken!: string | null;

  @Column({ default: () => 'NOW()' })
  creationDate!: Date;

  @ManyToOne(() => Role, (role) => role.user)
  @JoinColumn()
  role!: Role;

  static async createWithRole(data: NewUser & { roleName: RoleName }) {
    const role = await Role.findOne({ where: { name: data.roleName } });
    const { salt, hash } = await encryptPassword({ password: data.password });
    return User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      salt,
      hash,
      role,
    });
  }

  static findByEmail(
    email: string,
    options?: FindOneOptions<User>
  ): Promise<User | undefined> {
    return User.findOne({
      where: { email },
      ...options,
    });
  }

  static findByRefreshToken(
    refreshToken: string,
    options?: FindOneOptions<User>
  ): Promise<User | undefined> {
    return User.findOne({
      where: { refreshToken },
      ...options,
    });
  }
}
