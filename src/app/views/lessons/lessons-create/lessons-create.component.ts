import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'src/app/utils/forms/CustomValidators';

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
  readonly formGroup = new FormGroup({
    title: new FormControl('Lesson 1', [
      Validators.required,
      CustomValidators.blank,
    ]),
    content: new FormControl('', [Validators.required, CustomValidators.blank]),
  });

  editorKind: EditorKind = EditorKind.Text;
  markdownTab: MarkdownEditorTab = MarkdownEditorTab.Write;

  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {}

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

  getControl(name: string) {
    return this.formGroup.get(name) as FormControl;
  }

  back() {
    this.location.back();
  }

  submit() {
    console.log(this.formGroup.getRawValue());
  }
}
