import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentForm } from 'src/app/components/multi-choice-builder/multi-choice-builder.component';

@Component({
  selector: 'app-assessment-create',
  templateUrl: './assessment-create.component.html',
  styleUrls: ['./assessment-create.component.css'],
})
export class AssessmentCreateComponent implements OnInit {
  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {}

  onSubmit(assessmentForm: AssessmentForm) {
    console.log(assessmentForm);
  }

  get isEditing() {
    return this.router.url.includes('edit');
  }

  back() {
    this.location.back();
  }
}
