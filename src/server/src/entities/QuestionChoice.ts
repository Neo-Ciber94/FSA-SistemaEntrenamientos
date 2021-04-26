import {
  BaseEntity,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Question } from './Question';

@Entity()
@Unique(['choiceNumber', 'id'])
@Check(`"choiceNumber" >= 0`)
export class QuestionChoice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Question, (question) => question.questionChoices)
  @JoinColumn()
  question!: Question;

  @Column({ unsigned: true })
  choiceNumber!: number;

  @Column()
  choiceText!: string;
}
