import { CourseClassDTO } from './CourseClassDTO';
import { StudentCourseDTO } from './CourseStudentDTO';
import { UserDTO } from './UserDTO';

export interface CourseDTO {
  id: number;
  name: string;
  description?: string;
  isAvailable: boolean;
  teacher: UserDTO;
  classes: CourseClassDTO[];
  students: StudentCourseDTO[];
}
