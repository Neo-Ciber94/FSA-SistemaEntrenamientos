import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  readonly formGroup: FormGroup;

  wasValidated = false;
  isSubmitting = false;

  constructor(private authService: AuthService, private location: Location) {
    this.formGroup = new FormGroup({
      oldPassword: new FormControl(),
      newPassword: new FormControl(),
      confirmPassword: new FormControl(),
    });
  }

  ngOnInit(): void {}

  back() {
    this.location.back();
  }

  onSubmit() {}
}
