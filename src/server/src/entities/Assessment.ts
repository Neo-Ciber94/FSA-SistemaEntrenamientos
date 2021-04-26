import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CourseClass } from './CourseClass';
import { Question } from './Question';

@Entity()
@Unique(['title', 'courseClass'])
export class Assessment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @ManyToOne(() => CourseClass, (courseClass) => courseClass.assessments)
  @JoinColumn()
  courseClass!: CourseClass;

  @OneToMany(() => Question, (question) => question.assessment)
  @JoinColumn()
  questions!: Question[];
}
