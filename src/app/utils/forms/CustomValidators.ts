import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static get blank(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (isBlank(value)) {
        return { blank: true };
      }

      return null;
    };
  }

  static get empty(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (isBlank(value)) {
        return { empty: true };
      }

      if (Array.isArray(value)) {
        for (const e of value) {
          if (isBlank(e)) {
            return { empty: true };
          }
        }
      }

      return null;
    };
  }

  static get startOrEndWithspace(): ValidatorFn {
    return (control) => {
      const value = control.value;

      if (typeof value === 'string') {
        if (value.startsWith(' ') || value.endsWith(' ')) {
          return { whitespace: true };
        }
      }

      return null;
    };
  }
}

function isBlank(obj: any) {
  if (obj == null || obj.length === 0) {
    return true;
  }

  if (typeof obj === 'string' && obj.trim().length === 0) {
    return true;
  }

  return false;
}
