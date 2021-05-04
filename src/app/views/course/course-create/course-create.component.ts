import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';
import { UserService } from 'src/app/services/user.service';
import { CustomValidators, FormErrors, FormGroupTyped } from 'src/app/utils';
import { ifEmpty } from 'src/app/utils/ifEmpty';
import { CourseDTO, CourseNew, RoleName, UserDTO } from 'src/shared';

@Component({
  selector: 'app-course-create',
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.css'],
})
export class CourseCreateComponent implements OnInit {
  readonly formGroup = new FormGroupTyped({
    name: new FormControl('', [Validators.required, CustomValidators.blank]),
    description: new FormControl(),
    teacherId: new FormControl('', Validators.required),
  });

  readonly formErrors = new FormErrors(this.formGroup);
  teacherList: UserDTO[] = [];
  private teacher?: UserDTO;

  course?: CourseDTO;
  wasValidated = false;
  isSubmitting = false;

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    if (this.isEditing) {
      this.route.data.subscribe((data) => {
        console.assert(data.course);
        this.course = data.course;
        this.formGroup.controls.name.setValue(this.course?.name);
        this.formGroup.controls.description.setValue(this.course?.description);
        this.formGroup.controls.teacherId.setValue(this.course?.teacher.id);
      });
    }

    if (!this.isAdmin()) {
      this.teacher = this.authService.getCurrentUser()!;
      console.assert(this.teacher.role === RoleName.Teacher);
    }

    this.userService
      .getAllUsers()
      .pipe(
        map((data) => data.filter((user) => user.role === RoleName.Teacher))
      )
      .subscribe((data) => {
        this.teacherList = data;
      });
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

  getTeachers() {
    return this.teacherList;
  }

  back() {
    this.location.back();
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  async onSubmit() {
    this.wasValidated = true;
    this.formErrors.computeErrors();

    if (this.formGroup.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const newCourse: CourseNew = {
      name: this.formGroup.controls.name.value,
      description: ifEmpty(this.formGroup.controls.description.value),
      teacherId: this.formGroup.controls.teacherId.value,
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
