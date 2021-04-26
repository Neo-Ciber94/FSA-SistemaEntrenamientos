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

  isLogged() {
    return this.refreshToken != null;
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
