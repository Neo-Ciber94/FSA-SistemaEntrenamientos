import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CourseClassService } from 'src/app/services/course-class.service';
import { CourseService } from 'src/app/services/course.service';
import {
  CustomValidators,
  FormErrors,
  FormGroupTyped,
  ifEmpty,
} from 'src/app/utils';
import { CourseClassDTO, CourseClassNew, CourseDTO } from 'src/shared';

@Component({
  selector: 'app-class-create',
  templateUrl: './class-create.component.html',
  styleUrls: ['./class-create.component.css'],
})
export class ClassCreateComponent implements OnInit {
  course!: CourseDTO;
  courseClass?: CourseClassDTO;
  formGroup = new FormGroupTyped({
    name: new FormControl('', [Validators.required, CustomValidators.blank]),
    description: new FormControl(),
  });

  private formErrors = new FormErrors(this.formGroup);

  wasValidated = false;
  isSubmitting = false;

  constructor(
    private classService: CourseClassService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.assert(data.course);
      this.course = data.course;

      if (this.isEditing) {
        this.courseClass = data.courseClass;
        this.formGroup.controls.name.setValue(this.courseClass?.name);
        this.formGroup.controls.description.setValue(
          this.courseClass?.description
        );
      }
    });
  }

  get isEditing() {
    return this.router.url.includes('edit');
  }

  back() {
    this.location.back();
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  getInvalidClass(controlName: string) {
    return this.wasValidated && this.formErrors.getError(controlName)
      ? 'is-invalid'
      : '';
  }

  getError(controlName: string) {
    return this.formErrors.getError(controlName);
  }

  async onSubmit() {
    this.wasValidated = true;
    this.formGroup.markAllAsTouched();
    this.formErrors.computeErrors();

    if (this.isSubmitting || this.formGroup.invalid) {
      return;
    }

    this.isSubmitting = true;

    // prettier-ignore
    const newClass: CourseClassNew = {
      name: this.formGroup.controls.name.value,
      description: ifEmpty(this.formGroup.controls.description.value),
      courseId: this.course.id,
    };

    try {
      if (this.isEditing) {
        await this.classService
          .createClass({ ...newClass, id: this.courseClass?.id })
          .toPromise();
      } else {
        await this.classService.createClass(newClass).toPromise();
      }

      await this.router.navigate(['/courses', this.course.id]);
    } finally {
      this.isSubmitting = false;
    }
  }
}
