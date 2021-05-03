import {
  AbstractControl,
  FormArray,
  ValidationErrors,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { ValidationErrorKind } from './ValidationErrorKind';

export interface FormValidationErrors {
  [key: string]: string | null;
}

export interface ErrorMessages {
  [error: string]: string;
}

export class FormErrors {
  // tslint:disable-next-line: variable-name
  private _errors: FormValidationErrors = {};

  constructor(
    private formGroup: FormGroup,
    private errorMessages: ErrorMessages = {}
  ) {
    this.formGroup = formGroup;
  }

  private setControlError(controlName: string) {
    const control = this.formGroup.get(controlName)!;

    // `Validators.required` and `Validators.requireTrue`
    if (control.errors?.required) {
      this._errors[controlName] = this.getMessage(ValidationErrorKind.required);
    }
    // `CustomValidator.blank`
    else if (control.errors?.blank) {
      this._errors[controlName] = this.getMessage(ValidationErrorKind.blank);
    }
    // `CustomValidator.empty`
    else if (control.errors?.empty) {
      this._errors[controlName] = this.getMessage(ValidationErrorKind.empty);
    }
    // `Validators.email`
    else if (control.errors?.email) {
      this._errors[controlName] = this.getMessage(ValidationErrorKind.email);
    }
    // `Validators.pattern`
    else if (control.errors?.pattern) {
      this._errors[controlName] = this.getMessage(
        ValidationErrorKind.pattern,
        control.errors.pattern
      );
    }
    // `Validators.min`
    else if (control.errors?.min) {
      this._errors[controlName] = this.getMessage(
        ValidationErrorKind.min,
        control.errors.min
      );
    }
    // `Validators.max`
    else if (control.errors?.max) {
      this._errors[controlName] = this.getMessage(
        ValidationErrorKind.max,
        control.errors.max
      );
    }
    // `Validators.minlength`
    else if (control.errors?.minlength) {
      this._errors[controlName] = this.getMessage(
        ValidationErrorKind.minLength,
        control.errors.minlength
      );
    }
    // `Validators.maxlength`
    else if (control.errors?.maxlength) {
      this._errors[controlName] = this.getMessage(
        ValidationErrorKind.maxLength,
        control.errors.maxLength
      );
    }
    // Fallback
    else if (control.errors) {
      const key = Object.keys(control.errors)[0];
      this._errors[controlName] = this.getMessage(key) || 'Invalid value';
    }
    // No error
    else {
      this._errors[controlName] = null;
    }
  }

  private getMessage(kind: ValidationErrorKind | string, error?: any) {
    if (this.errorMessages[kind] != null) {
      return this.errorMessages[kind];
    }

    switch (kind) {
      case ValidationErrorKind.required:
        return 'Required';
      case ValidationErrorKind.blank:
        return 'Cannot be blank';
      case ValidationErrorKind.empty:
        return 'Cannot be empty';
      case ValidationErrorKind.email:
        return 'Invalid email format';
      case ValidationErrorKind.pattern:
        return `Invalid pattern, expected '${error.requiredPattern}'`;
      case ValidationErrorKind.min:
        return `Value must be greater or equals than ${error.min}`;
      case ValidationErrorKind.max:
        return `Value must be lower or equals than ${error.max}`;
      case ValidationErrorKind.minLength:
        return `Expected ${error.requiredLength} or more characters`;
      case ValidationErrorKind.maxLength:
        return `Expected ${error.requiredLength} or less characters`;
    }

    return null;
  }

  computeErrors() {
    this.formGroup.markAllAsTouched();

    for (const control in this.formGroup.controls) {
      if (control in this.formGroup.controls) {
        this.setControlError(control);
      }
    }
  }

  get errors() {
    return Object.assign({}, this._errors);
  }

  hasErrors() {
    for (const key in this._errors) {
      if (key in this._errors && this._errors[key]) {
        return true;
      }
    }

    return false;
  }

  setError(controlName: string, errors: ErrorMessages) {
    // Sets the new errors
    this.errorMessages = {
      ...this.errorMessages,
      ...errors,
    };

    const control = this.formGroup.get(controlName)!;

    // sets the new errors
    const controlErrors = {
      ...control.errors,
      ...errors,
    };

    control.setErrors(controlErrors);
    this.setControlError(controlName);
  }

  getError(controlName: string) {
    return this._errors[controlName];
  }

  clear() {
    this._errors = {};
  }
}
