import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './Question';
import { StudentAssessment } from './StudentAssessment';

@Entity()
export class Answer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => StudentAssessment, (assessment) => assessment.answers)
  @JoinColumn()
  studentAssessment!: StudentAssessment;

  @OneToOne(() => Question)
  @JoinColumn()
  question!: Question;

  @Column()
  answer!: string;
}
