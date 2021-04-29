import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User, UserSignup } from 'src/app/models';
import { AuthService } from 'src/app/services/auth.service';
import { CustomValidators } from 'src/app/utils/custom-validators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  readonly formGroup = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      CustomValidators.noBlank,
    ]),
    lastName: new FormControl('', [
      Validators.required,
      CustomValidators.noBlank,
    ]),
    email: new FormControl('', [
      Validators.email,
      Validators.required,
      CustomValidators.noBlank,
    ]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });

  wasValidated = false;
  isSubmitting = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  async onSubmit() {
    this.formGroup.markAllAsTouched();
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

    /// Register the new account and login the user
    await this.authService.signup(newUser).toPromise();
    await this.authService.login(newUser).toPromise();
    await this.router.navigateByUrl('/profile');
  }
}
