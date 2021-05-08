import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MultiChoiceQuestion } from 'src/shared';

@Component({
  selector: 'app-multi-choice',
  templateUrl: './multi-choice.component.html',
  styleUrls: ['./multi-choice.component.css'],
})
export class MultiChoiceComponent implements OnInit {
  @Input() formGroup?: FormGroup;
  @Input() multiChoice!: MultiChoiceQuestion;
  @Input() isInvalid = false;
  @Input() disabled = false;

  ngOnInit(): void {
    console.assert(this.multiChoice != null, '"multiChoice" is required');

    if (this.formGroup && this.multiChoice) {
      const control = this.getControl();
      this.multiChoice.selected = control.value;
    }
  }

  onChange(value: string) {
    this.multiChoice.selected = value;
  }

  getControl() {
    return this.formGroup!.get(this.multiChoice.key) as FormControl;
  }
}
