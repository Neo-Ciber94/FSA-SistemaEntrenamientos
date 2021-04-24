import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MultiChoiceQuestion } from './MultiChoiceQuestion';

@Component({
  selector: 'app-multi-choice',
  templateUrl: './multi-choice.component.html',
  styleUrls: ['./multi-choice.component.css'],
})
export class MultiChoiceComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;
  @Input() formGroup?: FormGroup;
  @Input() multiChoice!: MultiChoiceQuestion;
  @Input() isInvalid = false;

  ngOnInit(): void {
    console.assert(this.multiChoice != null, '"multiChoice" is required');

    if (this.formGroup && this.multiChoice) {
      const control = this.formGroup.get(this.multiChoice.key) as FormControl;
      this.multiChoice.selected = { value: control.value };

      this.subscription = control.valueChanges.subscribe((value) => {
        const selected = this.multiChoice.choices.find(
          (e) => e.value === value
        );
        this.multiChoice.selected = selected;
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
