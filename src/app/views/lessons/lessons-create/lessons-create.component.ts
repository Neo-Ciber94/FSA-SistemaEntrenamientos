import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lessons-create',
  templateUrl: './lessons-create.component.html',
  styleUrls: ['./lessons-create.component.css'],
})
export class LessonsCreateComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  get isEditing() {
    return this.router.url.includes('edit');
  }
}
