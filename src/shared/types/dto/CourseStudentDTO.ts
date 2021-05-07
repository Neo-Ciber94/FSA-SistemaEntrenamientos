import { CourseDTO } from './CourseDTO';

export interface CourseStudentDTO {
  id: number;
  studentId: number;
  userId: number;
  courseId: number;
  course: CourseDTO;
  isCompleted: boolean;
}
