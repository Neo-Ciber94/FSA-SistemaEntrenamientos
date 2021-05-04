import { QuestionDTO } from './QuestionDTO';

export interface QuestionChoiceDTO {
  id: number;
  question: QuestionDTO;
  choiceNumber: number;
  choiceText: string;
}
