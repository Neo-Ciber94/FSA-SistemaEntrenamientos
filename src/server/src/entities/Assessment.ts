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
@Unique('unique_lesson_name', ['title', 'courseClassId'])
export class Assessment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @OneToMany(() => Question, (question) => question.assessment)
  @JoinColumn()
  questions!: Question[];

  @Column()
  courseClassId!: number;

  @ManyToOne(() => CourseClass)
  @JoinColumn()
  courseClass!: CourseClass;

  @Column()
  classTaskId!: number;

  @OneToOne(() => ClassTask, { onDelete: 'CASCADE' })
  @JoinColumn()
  classTask!: ClassTask;
}
