import { MultiChoiceQuestion } from '../MultiChoiceQuestion';
import { AssessmentDTO } from './AssessmentDTO';
import { CourseStudentDTO } from './CourseStudentDTO';

export interface AssessmentAnswerDTO {
  id: number;
  student: CourseStudentDTO;
  assessmentId: number;
  assessment: AssessmentDTO;
  questionsAnswer: MultiChoiceQuestion[];
  calification: number;
}
