import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'src/app/utils/custom-validators';

enum EditorKind {
  Markdown,
  Text,
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
      CustomValidators.noBlank,
    ]),
    content: new FormControl('', [
      Validators.required,
      CustomValidators.noBlank,
    ]),
  });

  editorKind: EditorKind = EditorKind.Text;
  preview = false;

  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {}

  get isEditing() {
    return this.router.url.includes('edit');
  }

  get EditorKind() {
    return EditorKind;
  }

  get content() {
    return this.formGroup.get('content')?.value as string;
  }

  back() {
    this.location.back();
  }

  togglePreview(preview: boolean) {
    if (preview) {
      const textArea = document.querySelector('form textarea') as HTMLElement;
      const markdownPreview = document.querySelector(
        'form .markdown-preview'
      ) as HTMLElement;

      markdownPreview.style.height = `${
        textArea.getBoundingClientRect().height
      }px`;
    }

    this.preview = preview;
  }
}
