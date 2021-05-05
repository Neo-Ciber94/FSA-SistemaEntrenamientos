// tslint:disable: variable-name
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';
import { CourseDTO, RoleName, UserDTO } from 'src/shared';
import Swal from 'sweetalert2';

enum ShowCourses {
  MyCourses,
  AllCourses,
}

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  private _showCourses = ShowCourses.MyCourses;
  courses: CourseDTO[] = [];
  isLoading = false;
  searchCourse = '';
  user: UserDTO;

  set showCourses(show: ShowCourses) {
    console.log(show);
    this.loadCourses();
    this._showCourses = show;
  }

  get showCourses() {
    return this._showCourses;
  }

  canWrite() {
    if (this.user.role === RoleName.Admin) {
      return true;
    }

    return (
      this.showCourses === ShowCourses.MyCourses &&
      this.user.role === RoleName.Teacher
    );
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  constructor(
    private courseService: CourseService,
    private authService: AuthService
  ) {
    this.user = this.authService.getCurrentUser()!;
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  get ShowCourses() {
    return ShowCourses;
  }

  onDelete(course: CourseDTO) {
    Swal.fire({
      title: 'Delete course',
      showCancelButton: true,
      confirmButtonColor: 'var(--danger)',
      html: `
      Are you sure you want to delete the course <strong>${course.name}</strong>?
      `,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.courseService.deleteCourse(course.id).toPromise();
        const index = this.courses.findIndex((e) => e.id === course.id);
        this.courses.splice(index, 1);
      }
    });
  }

  getCourses() {
    return this.courses.filter((course) => {
      const courseName = course.name;
      const courseDescription = course.description;

      return (
        courseName.includes(this.searchCourse) ||
        courseDescription?.includes(this.searchCourse)
      );
    });
  }

  private loadCourses() {
    this.isLoading = true;

    const coursesObserver =
      this.showCourses === ShowCourses.AllCourses
        ? // Load all available courses
          this.courseService.getAllCourses()
        : // Load only this user courses
          this.courseService.getAllCourses(this.user.id);

    coursesObserver.subscribe((data) => {
      this.courses = data;
      this.isLoading = false;
    });
  }
}
