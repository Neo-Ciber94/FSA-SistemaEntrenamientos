import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CourseClass } from './CourseClass';

@Entity()
@Unique(['title', 'lessonClass'])
export class Lesson extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => CourseClass, (courseClass) => courseClass.lessons)
  @JoinColumn()
  lessonClass!: CourseClass;

  @Column()
  title!: string;

  @Column({ type: 'mediumtext' })
  content!: string;

  @Column()
  isMarkdown!: boolean;
}
