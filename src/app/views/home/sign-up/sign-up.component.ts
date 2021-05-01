import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User, UserSignup } from 'src/app/models';
import { AuthService } from 'src/app/services/auth.service';
import { CustomValidators } from 'src/app/utils/custom-validators';
import { FormErrors } from 'src/app/utils/FormErrors';
import { MIN_PASSWORD_LENGTH } from 'src/shared';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  readonly formGroup = new FormGroup({
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
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(MIN_PASSWORD_LENGTH),
    ]),
  });

  private formErrors = new FormErrors(this.formGroup);
  wasValidated = false;
  isSubmitting = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  getInvalidClass(controlName: string) {
    if (this.wasValidated && this.formGroup.get(controlName)?.invalid) {
      return 'is-invalid';
    }

    return '';
  }

  getError(controlName: string) {
    return this.formErrors.get(controlName);
  }

  async onSubmit() {
    this.formGroup.markAllAsTouched();
    this.formErrors.setErrors();
    this.wasValidated = true;

    if (this.isSubmitting || this.formGroup.invalid) {
      return;
    }

    this.isSubmitting = true;

    if (this.formGroup.invalid) {
      return;
    }

    if (
      this.formGroup.get('password')?.value !==
      this.formGroup.get('confirmPassword')
    ) {
      console.error('Password missmatch');
      return;
    }

    const newUser: UserSignup = {
      firstName: this.formGroup.get('firstName')?.value,
      lastName: this.formGroup.get('lastName')?.value,
      email: this.formGroup.get('email')?.value,
      password: this.formGroup.get('password')?.value,
    };

    /// Register the new account and login
    await this.authService.signup(newUser).toPromise();
    await this.authService.login(newUser).toPromise();
    await this.router.navigateByUrl('/profile');
  }
}
