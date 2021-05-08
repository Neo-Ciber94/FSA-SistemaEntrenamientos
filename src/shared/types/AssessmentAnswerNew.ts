import { MultiChoiceQuestion } from './MultiChoiceQuestion';

export interface AssessmentAnswerNew {
  assessmentId: number;
  studentId: number;
  questionsAnswer: MultiChoiceQuestion[];
}
