import { FormControl } from '@angular/forms';

export interface MultiChoiceQuestion {
  key: string;
  question: string;
  choices: Choice[];
  selected?: Choice;
}
export interface Choice {
  value: string;
}
