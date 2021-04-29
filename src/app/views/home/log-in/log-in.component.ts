import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
})
export class LogInComponent {
  wasValidate = false;
  invalidCredentials = false;
  private isSubmitting = false;

  readonly formGroup: FormGroup = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
  });

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.formGroup.markAllAsTouched();
    this.wasValidate = true;

    if (this.isSubmitting || this.formGroup.invalid) {
      return;
    }

    this.isSubmitting = true;
    const email = this.formGroup.get('email')?.value;
    const password = this.formGroup.get('password')?.value;

    this.authService
      .login({ email, password })
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (user) => {
          // FIXME: Remove log
          console.log('User Login: ', user);
          this.router.navigateByUrl('profile');
        },
        error: (err) => {
          this.invalidCredentials = true;
          console.error(err);
        },
      });
  }
}
