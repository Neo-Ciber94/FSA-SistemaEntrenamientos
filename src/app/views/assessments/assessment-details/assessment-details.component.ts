import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ClassAssessmentService } from 'src/app/services/class-assessment.service';
import { PermissionService } from 'src/app/services/permission.service';
import { StudentService } from 'src/app/services/student.service';
import {
  AssessmentAnswerDTO,
  AssessmentAnswerNew,
  AssessmentDTO,
  MultiChoiceQuestion,
  RoleName,
} from 'src/shared';

@Component({
  selector: 'app-assessment-details',
  templateUrl: './assessment-details.component.html',
  styleUrls: ['./assessment-details.component.css'],
})
export class AssessmentDetailsComponent implements OnInit {
  formGroup!: FormGroup;
  assessmentAnswer!: AssessmentAnswerDTO;
  assessment!: AssessmentDTO;

  wasValidated = false;
  isSubmitting = false;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private authService: AuthService,
    private studentService: StudentService,
    private assessmentService: ClassAssessmentService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.assert(data.assessment, data);
      this.assessment = data.assessment;
      this.assessmentAnswer = data.assessmentAnswer;
      this.assessment.questions.forEach((e) => {
        e.answer = undefined;
        e.selected = undefined;
      });
      this.createForm();
    });
  }

  get isStudent() {
    return this.authService.getCurrentUser()?.role === RoleName.Student;
  }

  canWrite() {
    return this.permissionService.canWrite(this.assessment.courseClass.course);
  }

  back() {
    this.location.back();
  }

  private createForm() {
    const controls: any = {};

    for (const c of this.assessment.questions) {
      c.selected = c.answer;
      controls[c.key] = new FormControl(c.answer);
    }

    this.formGroup = new FormGroup(controls);
  }

  async onSubmit() {
    if (this.isStudent === false) {
      return;
    }

    this.wasValidated = true;
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const student = await this.studentService
      .getStudentByUserId(this.authService.getCurrentUser()?.id!)
      .toPromise();

    const answer: AssessmentAnswerNew = {
      assessmentId: this.assessment.id,
      studentId: student.id,
      questionsAnswer: this.getAnswers(),
    };

    try {
      await this.assessmentService
        .postAssessmentResponse(
          this.assessment.courseClass.courseId,
          this.assessment.courseClassId,
          this.assessment.id,
          answer
        )
        .toPromise();

      window.location.reload();
    } finally {
      this.isSubmitting = false;
    }
  }

  private getAnswers(): MultiChoiceQuestion[] {
    const result: MultiChoiceQuestion[] = [];

    for (const question of this.assessment.questions) {
      if (!this.isStudent) {
        const control = this.formGroup.get(question.key)!;
        question.selected = control.value;
      }

      result.push(question);
    }

    return result;
  }
}
