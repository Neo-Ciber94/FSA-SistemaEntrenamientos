import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css'],
})
export class CourseCardComponent {
  @Input()
  course?: string;

  @Input()
  teacher?: string;

  edit() {
    console.log('EDIT');
  }

  delete() {
    console.log('DELETE');
  }
}
