import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { CustomValidators, FormErrors, FormGroupTyped } from 'src/app/utils';
import { ifEmpty } from 'src/app/utils/ifEmpty';
import { CourseDTO } from 'src/shared';

@Component({
  selector: 'app-course-create',
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.css'],
})
export class CourseCreateComponent implements OnInit {
  readonly formGroup = new FormGroupTyped({
    name: new FormControl('', [Validators.required, CustomValidators.blank]),
    description: new FormControl(),
  });

  readonly formErrors = new FormErrors(this.formGroup);

  course?: CourseDTO;
  wasValidated = false;
  isSubmitting = false;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    if (this.isEditing) {
      this.route.params.subscribe((data) => {
        console.assert(data.course);
        this.course = data.course;
        this.formGroup.controls.name.setValue(this.course?.name);
        this.formGroup.controls.description.setValue(this.course?.description);
      });
    }
  }

  get isEditing() {
    return this.router.url.includes('edit');
  }

  getInvalidClass(controlName: string) {
    return this.formErrors.getError(controlName) ? 'is-invalid' : '';
  }

  getError(controlName: string) {
    return this.formErrors.getError(controlName);
  }

  back() {
    this.location.back();
  }

  async onSubmit() {
    this.wasValidated = true;

    if (this.formGroup.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const newCourse: Pick<CourseDTO, 'name' | 'description'> = {
      name: this.formGroup.controls.name.value,
      description: ifEmpty(this.formGroup.controls.description.value),
    };

    try {
      if (this.isEditing) {
        await this.courseService
          .updateCourse({ id: this.course!.id, ...newCourse })
          .toPromise();
      } else {
        await this.courseService.createCourse(newCourse).toPromise();
      }

      await this.router.navigateByUrl('/courses');
    } finally {
      this.isSubmitting = false;
    }
  }
}
