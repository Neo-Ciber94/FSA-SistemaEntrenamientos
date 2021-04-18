import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  edit() {
    console.log('EDIT COURSE');
  }

  delete() {
    console.log('DELETE COURSE');
  }
}
