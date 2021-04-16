import { Component, OnInit } from '@angular/core';
import { Roles } from 'src/app/models/Roles';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  get role() {
    return Roles.Student;
  }
}
