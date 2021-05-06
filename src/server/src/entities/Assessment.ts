import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ClassTask } from './ClassTask';
import { CourseClass } from './CourseClass';
import { Question } from './Question';

@Entity()
export class Assessment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @OneToMany(() => Question, (question) => question.assessment)
  @JoinColumn()
  questions!: Question[];

  @Column()
  classTaskId!: number;

  @OneToOne(() => ClassTask, { onDelete: 'CASCADE' })
  @JoinColumn()
  classTask!: ClassTask;
}
