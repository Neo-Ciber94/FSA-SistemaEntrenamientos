import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as marked from 'marked';
import { LessonDTO } from 'src/shared';

@Component({
  selector: 'app-lessons-details',
  templateUrl: './lessons-details.component.html',
  styleUrls: ['./lessons-details.component.css'],
})
export class LessonsDetailsComponent implements OnInit {
  lesson!: LessonDTO;

  constructor(private location: Location, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.assert(data.lesson, data);
      this.lesson = data.lesson;
    });
  }

  isMarkdown() {
    return this.lesson.isMarkdown;
  }

  back() {
    this.location.back();
  }
}
