import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroupTyped } from 'src/app/utils';
import { RoleName, UserDTO, UserUpdate } from 'src/shared';
import Swal from 'sweetalert2';

type EditFormGroup = {
  firstName: FormControl;
  lastName: FormControl;
  role: FormControl;
};

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  readonly formGroup: FormGroupTyped<EditFormGroup>;
  readonly user: UserDTO;

  private previousRole: RoleName;
  wasValidated = false;
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private location: Location,
    private router: Router
  ) {
    this.user = authService.getCurrentUser()!;
    this.previousRole = this.user.role;
    this.formGroup = new FormGroupTyped({
      firstName: new FormControl(this.user.firstName),
      lastName: new FormControl(this.user.lastName),
      role: new FormControl(this.user.role),
    });
  }

  ngOnInit(): void {
    this.formGroup.controls.role.valueChanges.subscribe((newRole) => {
      if (this.previousRole !== newRole) {
        Swal.fire({
          title: 'Change role',
          confirmButtonColor: 'var(--danger)',
          showCancelButton: true,
          focusCancel: true,
          html: `
          Are you sure you want to change the role of the user <strong>${this.user.firstName} ${this.user.lastName}</strong>
          from <strong class='text-danger'>${this.previousRole}</strong> to <strong class='text-danger'>${newRole}</strong>?
          `.trim(),
        }).then((result) => {
          if (!result.isConfirmed) {
            return this.formGroup.controls.role.setValue(this.previousRole, {
              emitEvent: false,
            });
          }

          this.previousRole = newRole;
        });
      }
    });
  }

  get RoleName() {
    return RoleName;
  }

  get isAdmin() {
    return this.authService.isAdmin();
  }

  back() {
    this.location.back();
  }

  async onEdit() {
    this.wasValidated = true;

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const userUpdate: UserUpdate = {
      id: this.user.id,
      firstName: this.formGroup.controls.firstName.value,
      lastName: this.formGroup.controls.lastName.value,
      role: this.formGroup.controls.role.value,
    };

    try {
      await this.authService.update(userUpdate).toPromise();
      await this.router.navigateByUrl('/profile');
    } finally {
      this.isSubmitting = false;
    }
  }
}
