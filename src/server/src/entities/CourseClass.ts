import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Assessment } from './Assessment';
import { ClassTask } from './ClassTask';
import { Course } from './Course';
import { Lesson } from './Lesson';

@Entity()
@Unique('unique_class_name', ['name', 'courseId'])
export class CourseClass extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column()
  courseId!: number;

  @ManyToOne(() => Course, (course) => course.classes)
  @JoinColumn()
  course!: Course;

  @OneToMany(() => ClassTask, (classTask) => classTask.courseClass)
  @JoinColumn()
  tasks!: ClassTask[];
}
