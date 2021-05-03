import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { CustomValidators } from 'src/app/utils/forms/CustomValidators';
import { FormErrors } from 'src/app/utils/forms/FormErrors';
import { FormGroupTyped } from 'src/app/utils/forms/FormGroupTyped';
import { MIN_PASSWORD_LENGTH, UserSignup, validatePassword } from 'src/shared';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  readonly formGroup = new FormGroupTyped({
    firstName: new FormControl('', [
      Validators.required,
      CustomValidators.blank,
    ]),
    lastName: new FormControl('', [
      Validators.required,
      CustomValidators.blank,
    ]),
    email: new FormControl('', [
      Validators.email,
      Validators.required,
      CustomValidators.blank,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(MIN_PASSWORD_LENGTH),
    ]),
    passwordConfirm: new FormControl('', [
      Validators.required,
      Validators.minLength(MIN_PASSWORD_LENGTH),
    ]),
  });

  private formErrors = new FormErrors(this.formGroup, {
    missmatch: 'Password missmatch',
    emailExists: 'Email already exists',
  });
  wasValidated = false;
  isSubmitting = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  getInvalidClass(controlName: string) {
    if (
      this.wasValidated &&
      (this.formErrors.getError(controlName) ||
        this.formGroup.get(controlName)?.invalid)
    ) {
      return 'is-invalid';
    }

    return '';
  }

  getError(controlName: string): string | null {
    return this.formErrors.getError(controlName);
  }

  private checkPassword() {
    const password = this.formGroup.controls.password;
    const passwordConfirm = this.formGroup.controls.passwordConfirm;

    if (password.value !== passwordConfirm.value) {
      this.formGroup.controls.passwordConfirm.setErrors({
        missmatch: true,
      });
    }

    const validation = validatePassword(password.value);

    if (validation.type === 'invalid') {
      this.formErrors.setError(this.formGroup.controlNames.password, {
        password: validation.error,
      });
    }
  }

  private async checkEmailDontExist() {
    const emailControl = this.formGroup.controls.email;
    if (emailControl.valid) {
      const emailExist = await this.authService
        .checkEmail(emailControl.value)
        .toPromise();

      if (emailExist) {
        this.formGroup.controls.email.setErrors({
          emailExist: true,
        });
      }
    }
  }

  async onSubmit() {
    this.formGroup.markAllAsTouched();
    this.wasValidated = true;

    // Check the passwords
    this.checkPassword();

    // Check the email don't exists
    await this.checkEmailDontExist();

    // Compute the errors of the form
    this.formErrors.computeErrors();

    if (this.isSubmitting || this.formGroup.invalid) {
      return;
    }

    this.isSubmitting = true;

    const newUser: UserSignup = {
      firstName: this.formGroup.controls.firstName.value,
      lastName: this.formGroup.controls.lastName.value,
      email: this.formGroup.controls.email.value,
      password: this.formGroup.controls.password.value,
    };

    try {
      /// Register the new account and login
      await this.authService.signup(newUser).toPromise();
      await this.authService.login(newUser).toPromise();
      await this.router.navigateByUrl('/profile');
    } finally {
      this.isSubmitting = false;
    }
  }
}
