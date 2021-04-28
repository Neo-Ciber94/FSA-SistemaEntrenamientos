import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './Course';
import { AssessmentAnswers } from './AssessmentAnswers';
import { User } from './User';

@Entity()
export class CourseStudent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User)
  @JoinColumn()
  user!: User;

  @ManyToOne(() => Course, (course) => course.students)
  @JoinColumn()
  course!: Course;

  @Column({ default: false })
  isCompleted!: boolean;

  @ManyToOne(() => AssessmentAnswers, (assesment) => assesment.student)
  @JoinColumn()
  assessmentAnswers!: AssessmentAnswers[];
}
