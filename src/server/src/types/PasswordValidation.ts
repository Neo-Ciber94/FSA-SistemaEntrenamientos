export interface ValidPassword {
  type: 'valid';
}

export interface InvalidPassword {
  error: string;
  type: 'invalid';
}

export type PasswordValidation = ValidPassword | InvalidPassword;
