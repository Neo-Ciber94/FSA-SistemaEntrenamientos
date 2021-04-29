import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JWT_REFRESH_EXPIRATION_MS } from '../config/config';
import { User } from './User';

@Entity()
@Index('idx_token', ['refreshToken'])
export class UserSession extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn()
  user!: User;

  @CreateDateColumn()
  firstLogin!: Date;

  @Column({ type: 'varchar', unique: true })
  refreshToken!: string;

  @Column()
  tokenExpiration!: Date;

  @BeforeUpdate()
  @BeforeInsert()
  setTokenExpiration() {
    this.tokenExpiration = new Date(Date.now() + JWT_REFRESH_EXPIRATION_MS);
  }
}
