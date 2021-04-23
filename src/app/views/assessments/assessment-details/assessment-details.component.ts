import { Component, OnInit } from '@angular/core';
import { MultiChoiceQuestion } from 'src/app/components/multi-choice/MultiChoiceQuestion';

@Component({
  selector: 'app-assessment-details',
  templateUrl: './assessment-details.component.html',
  styleUrls: ['./assessment-details.component.css'],
})
export class AssessmentDetailsComponent implements OnInit {
  title = 'HTML and Headers';
  multiChoiceQuestions: MultiChoiceQuestion[] = [];

  constructor() {}

  ngOnInit(): void {
    this.multiChoiceQuestions = [
      {
        key: '1',
        question: 'What is HTML?',
        choices: [
          { value: 'Hypertext Markup languague' },
          { value: 'HTML text processor' },
          { value: 'Hyper transform media languague' },
        ],
      },
      {
        key: '2',
        question: 'What is H1?',
        choices: [
          { value: 'A html tag for big text' },
          { value: 'A html tag for small text' },
          { value: 'An invalid html tag' },
        ],
      },
    ];
  }
}
