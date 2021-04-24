import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MultiChoiceQuestion } from './MultiChoiceQuestion';

@Component({
  selector: 'app-multi-choice',
  templateUrl: './multi-choice.component.html',
  styleUrls: ['./multi-choice.component.css'],
})
export class MultiChoiceComponent implements OnInit {
  @Input() formGroup?: FormGroup;
  @Input() multiChoice!: MultiChoiceQuestion;

  ngOnInit(): void {
    console.assert(this.multiChoice != null, '"multiChoice" is required');
  }

  getFormControl() {
    if (this.formGroup == null || this.multiChoice == null) {
      return null;
    }

    const name = this.multiChoice.key;
    return this.formGroup.get(name) as FormControl;
  }
}
