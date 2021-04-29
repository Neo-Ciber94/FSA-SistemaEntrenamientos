import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from 'src/app/models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  readonly formGroup: FormGroup;
  readonly user: User;

  wasValidated = false;
  isSubmitting = false;

  constructor(private authService: AuthService, private location: Location) {
    this.user = authService.getCurrentUser()!;
    this.formGroup = new FormGroup({
      firstName: new FormControl(this.user.firstName),
      lastName: new FormControl(this.user.lastName),
      email: new FormControl(this.user.email),
    });
  }

  ngOnInit(): void {}

  get isAdmin() {
    return this.authService.isAdmin();
  }

  back() {
    this.location.back();
  }

  onEdit() {}
}
