import { ClassTaskDTO } from './ClassTaskDTO';
import { CourseClassDTO } from './CourseClassDTO';
import { QuestionDTO } from './QuestionDTO';

export interface AssessmentDTO {
  id: number;
  title: string;
  description?: string;
  questions: QuestionDTO[];
  classTask: ClassTaskDTO;
}
