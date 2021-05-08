import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiChoiceBuilderComponent } from 'src/app/components/multi-choice-builder/multi-choice-builder.component';
import { ClassAssessmentService } from 'src/app/services/class-assessment.service';
import {
  AssessmentDTO,
  AssessmentNew,
  CourseClassDTO,
  MultiChoiceQuestion,
} from 'src/shared';

@Component({
  selector: 'app-assessment-create',
  templateUrl: './assessment-create.component.html',
  styleUrls: ['./assessment-create.component.css'],
})
export class AssessmentCreateComponent implements OnInit {
  questions: MultiChoiceQuestion[] = [];
  assessment?: AssessmentDTO;

  titleError?: string;
  courseClass!: CourseClassDTO;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private assessmentService: ClassAssessmentService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.assert(data.courseClass, data);
      this.courseClass = data.courseClass;
      this.assessment = data.assessment;
      this.assessment?.questions?.forEach((e) => (e.selected = e.answer));
      this.questions = this.assessment?.questions || [];
    });
  }

  get isEditing() {
    return this.router.url.includes('edit');
  }

  back() {
    this.location.back();
  }

  private async checkTitleIsUnique(title: string) {
    const assessment = await this.assessmentService
      .getAssessmentByTitle(
        this.courseClass.courseId,
        this.courseClass.id,
        title
      )
      .toPromise();

    this.titleError = assessment
      ? `Already exist an assessment named '${title}'`
      : undefined;

    return this.titleError == null;
  }

  async onSubmit(multiChoiceQuestions: {
    title: string;
    questions: MultiChoiceQuestion[];
  }) {
    const isTitleUnique = await this.checkTitleIsUnique(
      multiChoiceQuestions.title
    );
    if (!isTitleUnique) {
      return;
    }

    // Check the question answer which is the currently selected element
    for (const question of multiChoiceQuestions.questions) {
      question.answer = question.selected;
      question.selected = undefined;
    }

    const newAssessment: AssessmentNew = {
      id: this.assessment?.id,
      title: multiChoiceQuestions.title,
      courseClassId: this.courseClass.id,
      questions: multiChoiceQuestions.questions,
    };

    if (this.isEditing) {
      await this.assessmentService
        .updateAssessment(
          this.courseClass.courseId,
          this.courseClass.id,
          newAssessment
        )
        .toPromise();
    } else {
      await this.assessmentService
        .createAssessment(
          this.courseClass.courseId,
          this.courseClass.id,
          newAssessment
        )
        .toPromise();
    }

    await this.router.navigate([
      '/courses',
      this.courseClass.courseId,
      'classes',
      this.courseClass.id,
    ]);
  }
}
