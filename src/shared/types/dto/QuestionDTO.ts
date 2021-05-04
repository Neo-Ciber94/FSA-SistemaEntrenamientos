import { AssessmentDTO } from './AssessmentDTO';
import { QuestionChoiceDTO } from './QuestionChoiceDTO';

export interface QuestionDTO {
  id: number;
  assessment: AssessmentDTO;
  questionText: string;
  questionAnswer: string;
  questionChoices: QuestionChoiceDTO[];
}
