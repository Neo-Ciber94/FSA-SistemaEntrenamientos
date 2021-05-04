import { AssessmentDTO } from './AssessmentDTO';
import { CourseDTO } from './CourseDTO';
import { LessonDTO } from './LessonDTO';

export interface CourseClassDTO {
  id: number;
  courseId: number;
  name: string;
  description?: string;
  course: CourseDTO;
  assessments: AssessmentDTO[];
  lessons: LessonDTO[];
}
