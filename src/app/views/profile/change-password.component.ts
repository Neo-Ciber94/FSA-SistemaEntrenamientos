import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormErrors, FormGroupTyped } from 'src/app/utils';
import {
  MIN_PASSWORD_LENGTH,
  UserDTO,
  UserPasswordUpdate,
  validatePassword,
} from 'src/shared';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  readonly formGroup = new FormGroupTyped({
    oldPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(MIN_PASSWORD_LENGTH),
    ]),
    passwordConfirm: new FormControl('', [
      Validators.required,
      Validators.minLength(MIN_PASSWORD_LENGTH),
    ]),
  });

  private user!: UserDTO;
  private formErrors = new FormErrors(this.formGroup);

  wasValidated = false;
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.assert(data.user);
      this.user = data.user;
    });
  }

  getInvalidClass(controlName: string) {
    if (this.formErrors.getError(controlName)) {
      return 'is-invalid';
    }

    return '';
  }

  getError(controlName: string) {
    return this.formErrors.getError(controlName);
  }

  back() {
    this.location.back();
  }

  private checkPassword() {
    const oldPassword = this.formGroup.controls.oldPassword;
    const newPassword = this.formGroup.controls.newPassword;
    const passwordConfirm = this.formGroup.controls.passwordConfirm;

    if (newPassword.value !== passwordConfirm.value) {
      this.formErrors.setError(this.formGroup.controlNames.passwordConfirm, {
        missmatch: 'Password missmatch',
      });
    }

    if (oldPassword.value === newPassword.value) {
      this.formErrors.setError(this.formGroup.controlNames.newPassword, {
        password: 'New password cannot be the same as the new',
      });
    }

    const validation = validatePassword(newPassword.value);

    if (validation.type === 'invalid') {
      this.formErrors.setError(this.formGroup.controlNames.newPassword, {
        password: validation.error,
      });
    }
  }

  async onSubmit() {
    this.wasValidated = true;
    this.checkPassword();
    this.formErrors.computeErrors();

    if (this.isSubmitting || this.formGroup.invalid) {
      return;
    }

    this.isSubmitting = true;
    const newPassword: UserPasswordUpdate = {
      id: this.user.id,
      password: this.formGroup.controls.oldPassword.value,
      newPassword: this.formGroup.controls.newPassword.value,
    };

    try {
      await this.authService.changePassword(newPassword).toPromise();
      await this.router.navigateByUrl(
        this.authService.getProfileRoute(this.user)
      );
    } finally {
      this.isSubmitting = false;
    }
  }
}
