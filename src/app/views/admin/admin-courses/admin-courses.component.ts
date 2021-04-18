import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.css'],
})
export class AdminCoursesComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();

  constructor() {}

  ngOnInit(): void {
    this.dtOptions = {
      pageLength: 6,
      info: false,
      lengthChange: false,
    };
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
