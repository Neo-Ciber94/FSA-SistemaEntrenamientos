import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CustomValidators } from 'src/app/utils/custom-validators';
import { getNextId } from 'src/app/utils/nextId';
import { MultiChoiceQuestion } from '../multi-choice/MultiChoiceQuestion';

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
  @ViewChild('questionEditor')
  private modalTemplate!: TemplateRef<any>;
  private questionEditorModal?: NgbModalRef;

  formGroup!: FormGroup;
  questionEditorFormGroup!: FormGroup;
  selectedItemId?: number;

  @Input()
  elements: EditableMultipleChoice[] = [];

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    const controls: any = {};

    for (const e of this.elements) {
      controls[e.multipleChoiceQuestion.key] = new FormControl();
    }

    this.formGroup = new FormGroup(controls);
  }

  get questions() {
    return this.elements.map((e) => e.multipleChoiceQuestion);
  }

  openQuestionEditor(id?: number) {
    if (id) {
      const selected = this.elements.find((e) => e.id === id);
      this.selectedItemId = id;
      // tslint:disable: no-non-null-assertion
      const title = selected!.multipleChoiceQuestion.question;
      const choices = selected!.multipleChoiceQuestion.choices.map(
        (e) => e.value
      );
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

    console.log(
      this.questionEditorFormGroup.status,
      this.questionEditorFormGroup.getRawValue()
    );

    const question = this.questionEditorFormGroup.get('questionTitle')
      ?.value as string;
    const choices = (this.questionEditorFormGroup.get('questionChoices')
      ?.value as string[]).map((e) => {
      return { value: e };
    });

    const multipleChoiceQuestion: MultiChoiceQuestion = {
      key: getNextId() + '',
      question,
      choices,
    };

    if (this.selectedItemId) {
      const index = this.elements.findIndex(
        (e) => e.id === this.selectedItemId
      );
      this.elements[index] = {
        id: getNextId(),
        multipleChoiceQuestion,
      };
    } else {
      this.elements.push({
        id: getNextId(),
        multipleChoiceQuestion,
      });
    }

    this.questionEditorModal?.close();
    this.render();
  }

  deleteQuestion(id: number) {
    const index = this.elements.findIndex((e) => e.id === id);
    this.elements.splice(index, 1);
    this.render();
  }

  debug() {
    console.log(this.formGroup.getRawValue());
  }

  private render() {
    const controls: any = {};

    for (const e of this.elements) {
      controls[e.multipleChoiceQuestion.key] = new FormControl(
        null,
        Validators.required
      );
    }

    this.formGroup = new FormGroup(controls);
  }

  private resetQuestionEditor(options?: { title: string; choices: string[] }) {
    const title = options?.title || 'Question title';
    const choices = options?.choices || ['Choice 1', 'Choice 2', 'Choice 3'];

    this.questionEditorFormGroup = new FormGroup({
      questionTitle: new FormControl(title, Validators.required),
      questionChoices: new FormControl(choices, [
        Validators.required,
        CustomValidators.noEmpty,
      ]),
    });
  }
}
