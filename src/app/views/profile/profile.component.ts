import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';
import { CourseDTO, RoleName, UserDTO } from 'src/shared';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  courses: CourseDTO[] = [];
  user!: UserDTO;

  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.parent!.data.subscribe((data) => {
      console.assert(data.user);
      this.user = data.user;

      // Loads the courses of the user
      if (this.user.role !== RoleName.Admin) {
        this.courseService.getAllCourses(this.user.id).subscribe((courses) => {
          this.courses = courses;
        });
      }
    });
  }

  canEdit() {
    return (
      this.authService.isCurrentUser(this.user) || this.authService.isAdmin()
    );
  }
}
