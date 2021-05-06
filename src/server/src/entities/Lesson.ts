import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ClassTask } from './ClassTask';

@Entity()
export class Lesson extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'mediumtext' })
  content!: string;

  @Column()
  isMarkdown!: boolean;

  @Column()
  classTaskId!: number;

  @OneToOne(() => ClassTask, { onDelete: 'CASCADE' })
  @JoinColumn()
  classTask!: ClassTask;
}
