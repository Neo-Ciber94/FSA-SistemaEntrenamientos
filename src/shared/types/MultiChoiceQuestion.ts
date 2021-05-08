export interface MultiChoiceQuestion {
  key: string;
  question: string;
  choices: string[];
  selected?: string;
  answer?: string;
}
