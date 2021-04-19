import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Role } from 'src/app/models/Role';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
})
export class LogInComponent implements OnInit, AfterViewInit {
  readonly formGroup: FormGroup = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
  });

  constructor(private authService: AuthService, private router: Router) {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      alert(`Valid users:\n
      admin@admin.com       (password: 123)
      teacher@teacher.com   (password: 123)
      student@student.com   (password: 123)
      `);
    }, 200);
  }

  ngOnInit(): void {}

  login() {
    const username = this.formGroup.get('email')?.value;
    const password = this.formGroup.get('password')?.value;

    this.authService.login({ username, password }).subscribe((user) => {
      if (user == null) {
        alert('Invalid user or passwrod');
      } else {
        this.router.navigateByUrl('profile');
      }
    });
  }
}
