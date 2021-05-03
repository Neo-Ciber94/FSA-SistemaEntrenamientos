import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CustomValidators, FormErrors, FormGroupTyped } from 'src/app/utils';
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
  formGroup!: FormGroupTyped<EditFormGroup>;
  user!: UserDTO;

  private previousRole!: RoleName;
  private formErrors!: FormErrors;
  wasValidated = false;
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.assert(data.user);

      this.user = data.user;
      this.previousRole = this.user.role;
      this.formGroup = new FormGroupTyped({
        firstName: new FormControl(this.user.firstName, [
          Validators.required,
          CustomValidators.blank,
        ]),
        lastName: new FormControl(this.user.lastName, [
          Validators.required,
          CustomValidators.blank,
        ]),
        role: new FormControl(this.user.role, [Validators.required]),
      });

      this.formErrors = new FormErrors(this.formGroup);
      this.startModalChangeWarning();
    });
  }

  startModalChangeWarning() {
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

  async onSubmit() {
    this.wasValidated = true;

    if (this.isSubmitting || this.formGroup.invalid) {
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
      await this.router.navigateByUrl(
        this.authService.getProfileRoute(this.user)
      );
    } finally {
      this.isSubmitting = false;
    }
  }
}
