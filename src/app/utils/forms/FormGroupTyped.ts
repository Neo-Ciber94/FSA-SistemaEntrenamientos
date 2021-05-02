import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';

interface FormControls {
  [key: string]: AbstractControl;
}

/**
 * A `FormControl` with all the types of its controls.
 */
export class FormGroupTyped<T extends FormControls> extends FormGroup {
  constructor(
    readonly controls: T,
    validatorOrOpts?:
      | ValidatorFn
      | ValidatorFn[]
      | AbstractControlOptions
      | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  get controlNames() {
    const keys = Object.keys(this.controls);
    const obj: Record<string, string> = {};

    for (const key of keys) {
      obj[key] = key;
    }

    return obj as Record<keyof T, string>;
  }
}
