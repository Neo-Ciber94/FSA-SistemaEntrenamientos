import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CustomValidators } from 'src/app/utils/forms/CustomValidators';
import { getNextId } from 'src/app/utils/nextId';
import { MultiChoiceQuestion } from 'src/shared';

interface EditableMultipleChoice {
  id: number;
  multipleChoiceQuestion: MultiChoiceQuestion;
}

@Component({
  selector: 'app-multi-choice-builder',
  templateUrl: './multi-choice-builder.component.html',
  styleUrls: ['./multi-choice-builder.component.css'],
})
export class MultiChoiceBuilderComponent implements OnInit {
  @Output()
  readonly submitForm = new EventEmitter<{
    title: string;
    questions: MultiChoiceQuestion[];
  }>();

  @ViewChild('questionEditor')
  private modalTemplate!: TemplateRef<any>;
  private questionEditorModal?: NgbModalRef;
  private isSubmitting = false;

  elements: EditableMultipleChoice[] = [];
  formGroup: FormGroup = new FormGroup({});
  questionEditorFormGroup!: FormGroup;
  selectedItemId?: number;
  wasValidated = false;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.render();
  }

  @Input()
  set questions(items: MultiChoiceQuestion[]) {
    this.elements = items.map((e) => {
      return {
        id: getNextId(),
        multipleChoiceQuestion: e,
      };
    });
  }

  get showDebug() {
    return true;
  }

  openQuestionEditor(id?: number) {
    if (id) {
      const selected = this.elements.find((e) => e.id === id);
      this.selectedItemId = id;
      const title = selected!.multipleChoiceQuestion.question;
      const choices = selected!.multipleChoiceQuestion.choices;
      this.resetQuestionEditor({ title, choices });
    } else {
      this.resetQuestionEditor();
    }

    this.questionEditorModal = this.modalService.open(this.modalTemplate);
  }

  addQuestion() {
    this.questionEditorFormGroup.markAllAsTouched();

    if (this.questionEditorFormGroup.invalid) {
      return;
    }

    const question = this.questionEditorFormGroup.get('questionTitle')
      ?.value as string;
    const choices = this.questionEditorFormGroup.get('questionChoices')
      ?.value as string[];

    if (this.selectedItemId) {
      const index = this.elements.findIndex(
        (e) => e.id === this.selectedItemId
      );

      // Updates the values
      const current = this.elements[index];
      current.multipleChoiceQuestion.question = question;
      current.multipleChoiceQuestion.choices = choices;
      this.selectedItemId = undefined;
    } else {
      // Create new MultiChoiceQuestion
      const newElement: MultiChoiceQuestion = {
        key: getNextId('multiChoiceQuestion').toString(),
        question,
        choices,
      };

      this.elements.push({
        id: getNextId(),
        multipleChoiceQuestion: newElement,
      });
    }

    this.questionEditorModal?.close();
    this.questionEditorModal = undefined;
    this.render();
  }

  deleteQuestion(id: number) {
    const index = this.elements.findIndex((e) => e.id === id);
    this.elements.splice(index, 1);
    this.render();
  }

  moveQuestionUp(id: number) {
    const index = this.elements.findIndex((e) => e.id === id);
    if (index > 0) {
      swap(this.elements, index, index - 1);
    }
  }

  moveQuestionDown(id: number) {
    const index = this.elements.findIndex((e) => e.id === id);
    if (index < this.elements.length - 1) {
      swap(this.elements, index, index + 1);
    }
  }

  debug() {
    console.log(this.formGroup.getRawValue());
  }

  submit() {
    if (this.isSubmitting) {
      return;
    }

    this.formGroup.markAllAsTouched();
    this.wasValidated = true;
    this.isSubmitting = true;

    if (this.formGroup.invalid || this.elements.length === 0) {
      return;
    }

    const title = this.formGroup.get('assessmentTitle')?.value as string;
    const questions = this.elements.map((e) => e.multipleChoiceQuestion);
    this.submitForm.emit({ title, questions });
    this.isSubmitting = false;
  }

  private render() {
    const controls: any = {};

    for (const e of this.elements) {
      const multiChoiceQuestion = e.multipleChoiceQuestion;
      controls[multiChoiceQuestion.key] = new FormControl(
        multiChoiceQuestion.selected,
        Validators.required
      );
    }

    const title = this.formGroup?.get('assessmentTitle')?.value || 'Title 1';

    this.formGroup = new FormGroup({
      assessmentTitle: new FormControl(title, [
        Validators.required,
        CustomValidators.blank,
      ]),
      ...controls,
    });
  }

  private resetQuestionEditor(options?: { title: string; choices: string[] }) {
    const title = options?.title || 'Question title';
    const choices = options?.choices || ['Choice 1', 'Choice 2', 'Choice 3'];

    this.questionEditorFormGroup = new FormGroup({
      questionTitle: new FormControl(title, Validators.required),
      questionChoices: new FormControl(choices, [
        Validators.required,
        CustomValidators.empty,
      ]),
    });
  }
}

function swap(elements: any[], indexA: number, indexB: number) {
  const temp = elements[indexA];
  elements[indexA] = elements[indexB];
  elements[indexB] = temp;
}
