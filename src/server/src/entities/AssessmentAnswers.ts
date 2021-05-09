import {
  BaseEntity,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Assessment } from './Assessment';
import { CourseStudent } from './CourseStudent';

@Entity()
@Check(`"calification" >= 0`)
export class AssessmentAnswers extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  studentId!: number;

  @ManyToOne(() => CourseStudent, (student) => student.assessmentAnswers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  student!: CourseStudent;

  @Column()
  assessmentId!: number;

  @OneToOne(() => Assessment)
  @JoinColumn()
  assessment!: Assessment;

  @Column({ type: 'text' })
  questionsAnswerJson!: string;

  @Column({ unsigned: true })
  calification!: number;
}
