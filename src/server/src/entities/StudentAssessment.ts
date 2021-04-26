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
import { StudentCourse } from './StudentCourse';

@Entity()
@Check(`"calification" >= 0`)
export class StudentAssessment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => StudentCourse, (student) => student.studentAssessments)
  @JoinColumn()
  student!: StudentCourse;

  @OneToOne(() => Assessment)
  @JoinColumn()
  assessment!: Assessment;

  @Column({ unsigned: true })
  calification!: number;

  @OneToMany(() => Answer, (answer) => answer.studentAssessment)
  @JoinColumn()
  answers!: Answer[];
}
