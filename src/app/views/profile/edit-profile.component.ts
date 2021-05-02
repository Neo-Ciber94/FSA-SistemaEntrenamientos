import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RoleName, UserDTO } from 'src/shared';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  readonly formGroup: FormGroup;
  readonly user: UserDTO;

  wasValidated = false;
  isSubmitting = false;

  constructor(private authService: AuthService, private location: Location) {
    this.user = authService.getCurrentUser()!;
    this.formGroup = new FormGroup({
      firstName: new FormControl(this.user.firstName),
      lastName: new FormControl(this.user.lastName),
      role: new FormControl(this.user.role),
    });
  }

  ngOnInit(): void {}

  get RoleName() {
    return RoleName;
  }

  get isAdmin() {
    return this.authService.isAdmin();
  }

  back() {
    this.location.back();
  }

  onEdit() {}
}
