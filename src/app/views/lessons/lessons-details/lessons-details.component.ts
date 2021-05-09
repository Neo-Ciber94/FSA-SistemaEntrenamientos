import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as marked from 'marked';
import { PermissionService } from 'src/app/services/permission.service';
import { LessonDTO } from 'src/shared';

@Component({
  selector: 'app-lessons-details',
  templateUrl: './lessons-details.component.html',
  styleUrls: ['./lessons-details.component.css'],
})
export class LessonsDetailsComponent implements OnInit {
  lesson!: LessonDTO;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.assert(data.lesson, data);
      this.lesson = data.lesson;
    });
  }

  isMarkdown() {
    return this.lesson.isMarkdown;
  }

  canWrite() {
    return this.permissionService.canWrite(this.lesson.courseClass.course);
  }

  back() {
    this.location.back();
  }
}
