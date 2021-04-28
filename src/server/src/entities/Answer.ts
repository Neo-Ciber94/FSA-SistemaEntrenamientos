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
import { AssessmentAnswers } from './AssessmentAnswers';

@Entity()
export class Answer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => AssessmentAnswers, (assessment) => assessment.answers)
  @JoinColumn()
  assessmentAnswers!: AssessmentAnswers;

  @OneToOne(() => Question)
  @JoinColumn()
  question!: Question;

  @Column()
  answer!: string;
}
