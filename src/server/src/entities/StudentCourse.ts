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
import { StudentAssessment } from './StudentAssessment';
import { User } from './User';

@Entity()
export class StudentCourse extends BaseEntity {
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

  @ManyToOne(() => StudentAssessment, (assesment) => assesment.student)
  @JoinColumn()
  studentAssessments!: StudentAssessment[];
}
