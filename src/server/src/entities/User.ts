import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  FindOneOptions,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DELETE_USER_AFTER_TIME } from '../config/config';
import { RoleName, UserDTO, UserSignup } from '../types';
import { encryptPassword } from '../utils';
import { Role } from './Role';
import { UserSession } from './UserSession';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ default: false })
  isDeleted!: boolean;

  @Column({ default: true })
  canDelete!: boolean;

  @Column()
  hash!: string;

  @Column()
  salt!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'datetime', nullable: true })
  deleteAt!: Date | null;

  @ManyToOne(() => Role, (role) => role.user)
  @JoinColumn()
  role!: Role;

  @OneToMany(() => UserSession, (session) => session.user, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  @JoinColumn()
  sessions!: UserSession[];

  markAsDeleted(deleteUser: boolean) {
    if (deleteUser) {
      this.isDeleted = true;
      this.deleteAt = new Date(Date.now() + DELETE_USER_AFTER_TIME);
    } else {
      this.isDeleted = false;
      this.deleteAt = null;
    }
  }

  static async createWithRole(data: UserSignup & { roleName: RoleName }) {
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
      ...options,
      where: { email },
    });
  }
}
