import { MultiChoiceQuestion } from '../MultiChoiceQuestion';
import { ClassTaskDTO } from './ClassTaskDTO';
import { CourseClassDTO } from './CourseClassDTO';

export interface AssessmentDTO {
  id: number;
  title: string;
  questions: MultiChoiceQuestion[];
  courseClassId: number;
  courseClass: CourseClassDTO;
  classTaskId: number;
  classTask: ClassTaskDTO;
}
