import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ClassTask } from './ClassTask';
import { CourseClass } from './CourseClass';

@Entity()
@Unique('unique_lesson_name', ['title', 'courseClassId'])
export class Lesson extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'mediumtext' })
  content!: string;

  @Column()
  isMarkdown!: boolean;

  @Column()
  courseClassId!: number;

  @ManyToOne(() => CourseClass)
  @JoinColumn()
  courseClass!: CourseClass;

  @Column()
  classTaskId!: number;

  @OneToOne(() => ClassTask, { onDelete: 'CASCADE' })
  @JoinColumn()
  classTask!: ClassTask;
}
