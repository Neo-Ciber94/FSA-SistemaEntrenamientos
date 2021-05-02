import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroupTyped } from 'src/app/utils';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
})
export class LogInComponent {
  wasValidate = false;
  invalidCredentials = false;
  private isSubmitting = false;

  readonly formGroup: FormGroup = new FormGroupTyped({
    email: new FormControl(),
    password: new FormControl(),
  });

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.formGroup.markAllAsTouched();
    this.wasValidate = true;

    if (this.isSubmitting || this.formGroup.invalid) {
      return;
    }

    this.isSubmitting = true;
    const email = this.formGroup.get('email')?.value;
    const password = this.formGroup.get('password')?.value;

    try {
      await this.authService.login({ email, password }).toPromise();
      await this.router.navigateByUrl('/profile');
    } catch {
      this.invalidCredentials = true;
    } finally {
      this.isSubmitting = false;
    }
  }
}
