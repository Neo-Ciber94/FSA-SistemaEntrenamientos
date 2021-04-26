import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Assessment } from './Assessment';
import { QuestionChoice } from './QuestionChoice';

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Assessment, (assessment) => assessment.questions)
  @JoinColumn()
  assessment!: Assessment;

  @Column()
  questionText!: string;

  @Column()
  questionAnswer!: string;

  @OneToMany(() => QuestionChoice, (choices) => choices.question)
  @JoinColumn()
  questionChoices!: QuestionChoice[];
}
