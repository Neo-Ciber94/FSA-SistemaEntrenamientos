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
import { Course } from './Course';
import { Lesson } from './Lesson';

@Entity()
export class CourseClass extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Course, (course) => course.classes)
  @JoinColumn()
  course!: Course;

  @OneToMany(() => Lesson, (lesson) => lesson.lessonClass)
  @JoinColumn()
  lessons!: Lesson[];

  @OneToMany(() => Assessment, (assessment) => assessment.courseClass)
  @JoinColumn()
  assessments!: Assessment[];
}
