import { CourseClassDTO } from './CourseClassDTO';
import { CourseStudentDTO } from './CourseStudentDTO';
import { UserDTO } from './UserDTO';

export interface CourseDTO {
  id: number;
  name: string;
  description?: string;
  teacherId: number;
  teacher: UserDTO;
  isAvailable: boolean;
  classes: CourseClassDTO[];
  students: CourseStudentDTO[];
}
