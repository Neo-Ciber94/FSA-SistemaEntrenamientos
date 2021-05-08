import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MultiChoiceQuestion } from 'src/shared';

@Component({
  selector: 'app-assessment-create',
  templateUrl: './assessment-create.component.html',
  styleUrls: ['./assessment-create.component.css'],
})
export class AssessmentCreateComponent implements OnInit {
  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {}

  get isEditing() {
    return this.router.url.includes('edit');
  }

  back() {
    this.location.back();
  }

  onSubmit(assessment: { title: string; questions: MultiChoiceQuestion[] }) {
    const questions = { questions: assessment.questions };
    console.log(assessment);
  }
}
