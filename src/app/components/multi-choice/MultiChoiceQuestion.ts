import { FormControl } from '@angular/forms';

export interface MultiChoiceQuestion {
  key: string;
  question: string;
  choices: Choice[];
}
export interface Choice {
  value: string;
}
