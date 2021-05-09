import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CourseClassService } from 'src/app/services/course-class.service';
import { CourseService } from 'src/app/services/course.service';
import { PermissionService } from 'src/app/services/permission.service';
import { StudentService } from 'src/app/services/student.service';
import {
  CourseClassDTO,
  CourseDTO,
  CourseStudentDTO,
  RoleName,
} from 'src/shared';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
})
export class CourseDetailsComponent implements OnInit {
  student?: CourseStudentDTO;
  canEdit = false;
  course!: CourseDTO;

  private isProccesing = false;

  constructor(
    private courseService: CourseService,
    private classService: CourseClassService,
    private authService: AuthService,
    private permissionService: PermissionService,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.assert(data.course);
      this.course = data.course;
      this.canEdit =
        this.course.teacher.id === this.authService.getCurrentUser()?.id ||
        this.authService.isAdmin();
    });

    this.loadStudent();
  }

  canWrite() {
    return this.permissionService.canWrite(this.course);
  }

  canShowStudentActions() {
    return (
      this.authService.getCurrentUser()?.role === RoleName.Student &&
      !this.student?.isCompleted
    );
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  async deleteClass(courseClass: CourseClassDTO) {
    await this.classService
      .deleteClass(courseClass.courseId, courseClass.id)
      .toPromise();

    const index = this.course.classes.findIndex((e) => e.id === courseClass.id);
    this.course.classes.splice(index, 1);
  }

  async joinOrLeaveCourse() {
    if (this.isProccesing) {
      return;
    }

    const user = this.authService.getCurrentUser()!;
    this.isProccesing = true;

    // Adding a new student
    if (this.student == null) {
      try {
        this.student = await this.studentService
          .addStudent(this.course.id, { userId: user.id })
          .toPromise();
      } finally {
        this.isProccesing = false;
      }
    }
    // Removing a student
    else {
      Swal.fire({
        title: 'Leave course',
        html: `Are you sure about leaving the <strong>${this.course.name}</strong> course?`,
        showCancelButton: true,
      })
        .then((result) => {
          if (result.isConfirmed) {
            this.studentService
              .deleteStudent(this.student?.id!)
              .subscribe(() => {
                this.student = undefined;
              });
          }
        })
        .finally(() => {
          this.isProccesing = false;
        });
    }
  }

  private loadStudent() {
    this.studentService
      .getStudentByUserId(this.authService.getCurrentUser()?.id!)
      .subscribe((data) => {
        this.student = data;
      });
  }
}
