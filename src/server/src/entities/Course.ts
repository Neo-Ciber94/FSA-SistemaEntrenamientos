import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseClass } from './CourseClass';
import { CourseStudent } from './CourseStudent';
import { User } from './User';

@Entity()
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ default: false })
  isAvailable!: boolean;

  @OneToOne(() => User)
  @JoinColumn()
  teacher!: User;

  @OneToMany(() => CourseClass, (courseClass) => courseClass.course)
  @JoinColumn()
  classes!: CourseClass[];

  @OneToMany(() => CourseStudent, (student) => student.course)
  @JoinColumn()
  students!: CourseStudent[];
}
