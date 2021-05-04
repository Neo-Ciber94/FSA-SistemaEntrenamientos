import {
  AfterInsert,
  BaseEntity,
  BeforeInsert,
  BeforeRemove,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleName } from '../types';
import { CourseClass } from './CourseClass';
import { CourseStudent } from './CourseStudent';
import { User } from './User';

// TODO: Cannot add classes, assessments or lessons in a course with students,
// while a course have students must be `readonly`
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

  @Column()
  teacherId!: number;

  @OneToOne(() => User)
  @JoinColumn()
  teacher!: User;

  @OneToMany(() => CourseClass, (courseClass) => courseClass.course)
  @JoinColumn()
  classes!: CourseClass[];

  @OneToMany(() => CourseStudent, (student) => student.course)
  @JoinColumn()
  students!: CourseStudent[];

  @BeforeInsert()
  @BeforeUpdate()
  async checkUserIsTeacher() {
    const teacher = await this.getTeacher(['role']);

    if (teacher == null) {
      throw new Error('Teacher is null');
    }

    // FIXME: This should be enforced in the database
    if (teacher.role.name !== RoleName.Teacher) {
      throw new Error(
        'Invalid role, a course can only be assignned to a teacher'
      );
    }
  }

  @AfterInsert()
  async markTeacherCanDeleteToFalse() {
    const teacher = await this.getTeacher();
    teacher.canDelete = false;
    return User.save(teacher);
  }

  @BeforeRemove()
  async checkIfCanDeleteTeacher() {
    let teacher = await this.getTeacher();

    if (teacher.isDeleted && teacher.canDelete === false) {
      const numberOfCourses = await Course.count({ where: { teacher } });
      if (numberOfCourses === 0) {
        teacher.markAsDeleted(true);
        await User.save(teacher);
      }
    }
  }

  private async getTeacher(relations: string[] = []) {
    const teacher = await User.findOne(this.teacherId, { relations });

    if (teacher == null) {
      throw new Error(`teacher user with id '${this.teacherId}' not found`);
    }

    return teacher;
  }
}
