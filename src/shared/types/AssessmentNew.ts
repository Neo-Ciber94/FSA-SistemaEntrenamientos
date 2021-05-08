import { MultiChoiceQuestion } from './MultiChoiceQuestion';

export interface AssessmentNew {
  id?: number;
  title: string;
  courseClassId: number;
  questions: MultiChoiceQuestion[];
}
