import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseClassService } from 'src/app/services/course-class.service';
import { ClassTaskDTO, CourseClassDTO, TaskType } from 'src/shared';

@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.css'],
})
export class ClassDetailsComponent implements OnInit {
  courseClass!: CourseClassDTO;
  classTasks: ClassTaskDTO[] = [];

  constructor(
    private classService: CourseClassService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.assert(data.courseClass, data);
      this.courseClass = data.courseClass;

      this.classService
        .getTasks(this.courseClass.courseId, this.courseClass.id)
        .subscribe((tasks) => {
          this.classTasks = tasks;
        });
    });
  }

  getRoute(classTask: ClassTaskDTO) {
    switch (classTask.taskType) {
      case TaskType.Assessment:
        return `assessments/${classTask.classTask.id}`;
      case TaskType.Lesson:
        return `lessons/${classTask.classTask.id}`;
      default:
        throw new Error(`Invalid task type: ${classTask}`);
    }
  }
}
