import { MultiChoiceQuestion } from './MultiChoiceQuestion';

export class AssessmentQuestions {
  readonly questions: MultiChoiceQuestion[];

  constructor(questions: MultiChoiceQuestion[] | string) {
    if (typeof questions === 'string') {
      this.questions = (JSON.parse(questions) as AssessmentQuestions).questions;
    } else {
      this.questions = questions.slice();
    }

    Object.freeze(this.questions);
    this.assertQuestionsHaveAnswers();
  }

  get length() {
    return this.questions.length;
  }

  computeCalification() {
    let result = 0;

    for (const multiChoice of this.questions) {
      if (multiChoice.selected === multiChoice.answer) {
        result += 1;
      }
    }

    return result;
  }

  toJson() {
    return JSON.stringify(this);
  }

  get isCompleted() {
    for (const e of this.questions) {
      if (e.selected == null) {
        return false;
      }
    }
    return true;
  }

  private assertQuestionsHaveAnswers() {
    for (const multiChoice of this.questions) {
      if (multiChoice.answer == null) {
        throw new Error(
          `question '${multiChoice.question}' don't have an answer`
        );
      }
    }
  }
}
