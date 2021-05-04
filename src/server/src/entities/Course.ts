import {
  AfterInsert,
  BaseEntity,
  BeforeRemove,
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

  @AfterInsert()
  async markTeacherCanDeleteToFalse() {
    const teacher = await this.getTeacher();
    teacher.canDelete = false;
    await User.save(teacher);
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

  private async getTeacher() {
    let teacher: User = this.teacher;

    if (!teacher) {
      teacher = await Course.findOne(this.id, { relations: ['teacher'] }).then(
        (e) => e!.teacher
      );
    }

    return teacher;
  }
}
