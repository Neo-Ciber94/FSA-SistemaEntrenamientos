import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CoursesService } from 'src/app/services/courses.service';
import { CourseDTO } from 'src/shared';

@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.css'],
})
export class AdminCoursesComponent implements OnInit, OnDestroy {
  courses: CourseDTO[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();

  constructor(private courseServices: CoursesService) {}

  ngOnInit(): void {
    this.courseServices.getAllCourses().subscribe((data) => {
      this.courses = data;
      this.dtTrigger.next();
    });

    this.dtOptions = {
      pageLength: 6,
      info: false,
      lengthChange: false,
      scrollX: true,

      initComplete: () => {
        // prettier-ignore
        const element = document.querySelector('#table-container') as HTMLElement;
        element.style.opacity = '1';
      },
    };
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
