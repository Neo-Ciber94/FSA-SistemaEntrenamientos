import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassAssessmentService } from 'src/app/services/class-assessment.service';
import { ClassLessonService } from 'src/app/services/class-lesson.service';
import { CourseClassService } from 'src/app/services/course-class.service';
import { ClassTaskDTO, CourseClassDTO, TaskType } from 'src/shared';
import Swal from 'sweetalert2';

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
    private lessonService: ClassLessonService,
    private assessmentService: ClassAssessmentService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.assert(data.courseClass, data);
      this.courseClass = data.courseClass;

      this.classService
        .getTasks(this.courseClass.courseId, this.courseClass.id)
        .subscribe((tasks) => {
          this.classTasks = tasks.sort((t1, t2) => t1.order - t2.order);
        });
    });
  }

  getRoute(classTask: ClassTaskDTO) {
    switch (classTask.taskType) {
      case TaskType.Assessment:
        return `assessments/${classTask.task.id}`;
      case TaskType.Lesson:
        return `lessons/${classTask.task.id}`;
      default:
        throw new Error(`Invalid task type: ${classTask}`);
    }
  }

  deleteTask(task: ClassTaskDTO) {
    Swal.fire({
      title: 'Delete Task',
      html: `Are you sure about delete ${task.taskType} <strong>${task.task.title}</strong>?`,
      showCancelButton: true,
      focusCancel: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const index = this.classTasks.findIndex((e) => e.id === task.id);

        switch (task.taskType) {
          case TaskType.Lesson:
            this.classTasks.splice(index, 1);

            await this.lessonService
              .deleteLesson(
                task.courseClass.courseId,
                task.courseClassId,
                task.task.id
              )
              .toPromise();
            this.reload();
            break;
          case TaskType.Assessment:
            this.classTasks.splice(index, 1);
            await this.assessmentService
              .deleteAssessment(
                task.courseClass.courseId,
                task.courseClassId,
                task.task.id
              )
              .toPromise();
            this.reload();
            break;
        }
      }
    });
  }

  async moveUp(task: ClassTaskDTO) {
    if (task.order > 0) {
      const courseId = this.courseClass.courseId;
      const classId = this.courseClass.id;

      //this.swap(task.order, task.order - 1);
      await this.classService
        .moveTask(courseId, classId, {
          classTaskId: task.id,
          order: task.order - 1,
        })
        .toPromise();
      this.reload();
    }
  }

  async moveDown(task: ClassTaskDTO) {
    if (task.order < this.classTasks.length - 1) {
      const courseId = this.courseClass.courseId;
      const classId = this.courseClass.id;

      //this.swap(task.order, task.order + 1);
      await this.classService
        .moveTask(courseId, classId, {
          classTaskId: task.id,
          order: task.order + 1,
        })
        .toPromise();
      this.reload();
    }
  }

  private swap(a: number, b: number) {
    const temp = this.classTasks[a];
    this.classTasks[a] = this.classTasks[b];
    this.classTasks[b] = temp;

    const orderTemp = this.classTasks[a].order;
    this.classTasks[a].order = this.classTasks[b].order;
    this.classTasks[b].order = orderTemp;
  }

  private reload() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigateByUrl(this.router.url);
  }
}
