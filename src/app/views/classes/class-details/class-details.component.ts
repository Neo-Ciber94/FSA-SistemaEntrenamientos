import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseClassService } from 'src/app/services/course-class.service';
import { CourseClassDTO } from 'src/shared';

interface ClassTask {
  id: number;
  name: string;
  type: 'assessments' | 'lessons';
}

@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.css'],
})
export class ClassDetailsComponent implements OnInit {
  courseClass!: CourseClassDTO;
  classTasks: ClassTask[] = [];

  constructor(
    private classService: CourseClassService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.assert(data.courseClass, data);
      this.courseClass = data.courseClass;
    });
  }
}
