import { MIN_PASSWORD_LENGTH } from '../config';

export interface PasswordValid {
  type: 'valid';
}

export interface PasswordInvalid {
  error: string;
  type: 'invalid';
}

export type PasswordValidation = PasswordValid | PasswordInvalid;

// Any ASCII from `33` to `126`
const asciiRegex = /^[!-~]*$/;
const whitespaceRegex = /\s/;

export function validatePassword(password: string): PasswordValidation {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      type: 'invalid',
      error: `A password must have ${MIN_PASSWORD_LENGTH} or more characters`,
    };
  }

  if (whitespaceRegex.test(password)) {
    return {
      type: 'invalid',
      error: 'A password cannot contain whitespaces',
    };
  }

  if (!asciiRegex.test(password)) {
    return {
      type: 'invalid',
      error:
        'A password can only contain numbers from (0-9), characters (A-Z) or symbols',
    };
  }

  return { type: 'valid' };
}
