import { FormGroup } from '@angular/forms';

export class FormErrors {
  private formGroup: FormGroup;
  private errors: Record<string, string | null> = {};

  constructor(formGroup: FormGroup) {
    this.formGroup = formGroup;
  }

  private setErrorForControl(controlName: string) {
    const control = this.formGroup.get(controlName)!;
    this.errors[controlName] = null;

    if (control.errors?.required) {
      this.errors[controlName] = 'Required';
    } else if (control.errors?.blank) {
      this.errors[controlName] = 'Cannot be blank';
    } else if (control.errors?.email) {
      this.errors[controlName] = 'Invalid email format';
    } else if (control.errors?.min) {
      const errorMin = control.errors.min as { min: { min: number } };

      this.errors[
        controlName
      ] = `Value must be greater or equals than ${errorMin.min}`;
    } else if (control.errors?.max) {
      const errorMax = control.errors.max as { max: { max: number } };

      this.errors[
        controlName
      ] = `Value must be lower or equals than ${errorMax.max}`;
    } else if (control.errors?.minLength) {
      const errorMinLength = control.errors.minLength as {
        minLength: { requiredLength: number };
      };

      this.errors[
        controlName
      ] = `Expected ${errorMinLength.minLength} or more characters`;
    } else if (control.errors?.maxLength) {
      const errorMaxLength = control.errors.maxLength as {
        maxLength: { requiredLength: number };
      };

      this.errors[
        controlName
      ] = `Expected ${errorMaxLength.maxLength} or less characters`;
    }
  }

  setErrors() {
    this.errors = {};
    for (const control in this.formGroup.controls) {
      if (control in this.formGroup.controls) {
        this.setErrorForControl(control);
      }
    }
  }

  clear() {
    this.errors = {};
  }

  get(controlName: string) {
    return this.errors[controlName];
  }
}
