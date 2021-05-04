import { CourseClassDTO } from './CourseClassDTO';
import { QuestionDTO } from './QuestionDTO';

export interface AssessmentDTO {
  id: number;
  title: string;
  description?: string;
  courseClass: CourseClassDTO;
  questions: QuestionDTO[];
}
