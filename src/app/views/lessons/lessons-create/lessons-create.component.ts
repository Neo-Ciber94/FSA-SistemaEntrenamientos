import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassLessonService } from 'src/app/services/class-lesson.service';
import { FormErrors, FormGroupTyped } from 'src/app/utils';
import { CustomValidators } from 'src/app/utils/forms/CustomValidators';
import { CourseClassDTO, LessonDTO, LessonNew } from 'src/shared';

enum EditorKind {
  Markdown,
  Text,
}

enum MarkdownEditorTab {
  Write,
  Preview,
}

@Component({
  selector: 'app-lessons-create',
  templateUrl: './lessons-create.component.html',
  styleUrls: ['./lessons-create.component.css'],
})
export class LessonsCreateComponent implements OnInit {
  readonly formGroup = new FormGroupTyped({
    title: new FormControl('Lesson 1', [
      Validators.required,
      CustomValidators.blank,
    ]),
    content: new FormControl('', [Validators.required, CustomValidators.blank]),
  });

  private formErrors = new FormErrors(this.formGroup);

  courseClass!: CourseClassDTO;
  lesson?: LessonDTO;
  editorKind: EditorKind = EditorKind.Text;
  markdownTab: MarkdownEditorTab = MarkdownEditorTab.Write;

  wasValidated = false;
  isSubmitting = false;

  constructor(
    private router: Router,
    private location: Location,
    private lessonService: ClassLessonService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.assert(data.courseClass, data);
      this.courseClass = data.courseClass;

      if (this.isEditing) {
        console.assert(data.lesson, data);
        this.lesson = data.lesson;
        this.formGroup.controls.title.setValue(this.lesson?.title);
        this.formGroup.controls.content.setValue(this.lesson?.content);
      }
    });
  }

  get isEditing() {
    return this.router.url.includes('edit');
  }

  get EditorKind() {
    return EditorKind;
  }

  get MarkdownEditorTab() {
    return MarkdownEditorTab;
  }

  get content() {
    return this.formGroup.get('content')?.value as string;
  }

  isMarkdown() {
    return this.editorKind === EditorKind.Markdown;
  }

  back() {
    this.location.back();
  }

  getInvalidClass(controlName: string) {
    return this.wasValidated && this.formErrors.getError(controlName)
      ? 'is-invalid'
      : '';
  }

  getError(controlName: string) {
    return this.formErrors.getError(controlName);
  }

  async onSubmit() {
    this.wasValidated = true;
    this.formErrors.computeErrors();

    if (this.isSubmitting || this.formGroup.invalid) {
      return;
    }

    this.isSubmitting = true;
    const newLesson: LessonNew = {
      id: this.lesson?.id,
      title: this.formGroup.controls.title.value,
      content: this.formGroup.controls.content.value,
      isMarkdown: this.isMarkdown(),
      courseClassId: this.courseClass.id,
    };

    try {
      if (this.isEditing) {
        await this.lessonService
          .updateLesson(
            this.courseClass.courseId,
            this.courseClass.id,
            newLesson
          )
          .toPromise();
      } else {
        await this.lessonService
          .createLesson(
            this.courseClass.courseId,
            this.courseClass.id,
            newLesson
          )
          .toPromise();
      }

      await this.router.navigate([
        '/courses',
        this.courseClass.courseId,
        'classes',
        this.courseClass.id,
      ]);
    } finally {
      this.isSubmitting = false;
    }
  }
}
