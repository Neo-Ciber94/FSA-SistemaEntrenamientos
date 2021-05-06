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
import { TaskType } from '../../../shared';
import { CourseClass } from './CourseClass';

@Entity()
@Unique('unique_task', ['order', 'courseClassId'])
@Check('order >= -1')
@Check(`taskType IN ("${TaskType.Assessment}", "${TaskType.Lesson}")`)
export class ClassTask extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  order!: number;

  @Column()
  taskType!: string;

  @Column()
  courseClassId!: number;

  @ManyToOne(() => CourseClass, (courseClass) => courseClass.tasks)
  @JoinColumn()
  courseClass!: CourseClass;

  static nextOrder(courseClassId: number) {
    // FIXME: Could be nice to store this in memory, but could lead to errors if data inserted in the database directly
    return ClassTask.count({
      where: { courseClassId },
    });
  }
}
