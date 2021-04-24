import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assessment-create',
  templateUrl: './assessment-create.component.html',
  styleUrls: ['./assessment-create.component.css'],
})
export class AssessmentCreateComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  get isEditing() {
    return this.router.url.includes('edit');
  }
}
