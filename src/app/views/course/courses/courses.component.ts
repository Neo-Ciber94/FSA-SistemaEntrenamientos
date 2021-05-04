import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CourseService } from 'src/app/services';
import { CourseDTO } from 'src/shared';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  courses: CourseDTO[] = [];
  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe((data) => {
      this.courses = data;
    });
  }

  edit() {
    console.log('EDIT COURSE');
  }

  delete() {
    console.log('DELETE COURSE');
  }
}
