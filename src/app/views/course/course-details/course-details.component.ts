import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';
import { CourseDTO } from 'src/shared';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
})
export class CourseDetailsComponent implements OnInit {
  canEdit = false;
  course!: CourseDTO;

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
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
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  deleteClass(classId: number) {
    console.log('DELETE CLASS', classId);
  }
}
