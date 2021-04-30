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
  UpdateDateColumn,
} from 'typeorm';
import {
  JWT_REFRESH_EXPIRATION_MS,
  MAX_SESSIONS_PER_USER,
} from '../config/config';
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
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'varchar', unique: true })
  refreshToken!: string;

  @Column()
  tokenExpiration!: Date;

  @BeforeUpdate()
  @BeforeInsert()
  setTokenExpiration() {
    this.tokenExpiration = new Date(Date.now() + JWT_REFRESH_EXPIRATION_MS);
  }

  @BeforeInsert()
  async checkMaxSessionPerUser() {
    const user = await User.findOne(this.user, { relations: ['sessions'] });

    if (user && user.sessions.length === MAX_SESSIONS_PER_USER) {
      // We check the update date of the sessions and remove the oldest one.
      const oldestSession = user.sessions.reduce((session, current) => {
        return session.updatedAt < current.updatedAt ? session : current;
      });

      await UserSession.remove(oldestSession);
    }
  }
}
