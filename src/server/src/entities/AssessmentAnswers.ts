import {
  BaseEntity,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Answer } from './Answer';
import { Assessment } from './Assessment';
import { CourseStudent } from './CourseStudent';

@Entity()
@Check(`"calification" >= 0`)
export class AssessmentAnswers extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => CourseStudent, (student) => student.assessmentAnswers)
  @JoinColumn()
  student!: CourseStudent;

  @OneToOne(() => Assessment)
  @JoinColumn()
  assessment!: Assessment;

  @Column({ unsigned: true })
  calification!: number;

  @OneToMany(() => Answer, (answer) => answer.assessmentAnswers)
  @JoinColumn()
  answers!: Answer[];
}
