import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AssessmentAnswerDTO } from 'src/shared';
import { AuthService } from '../services/auth.service';
import { ClassAssessmentService } from '../services/class-assessment.service';
import { StudentService } from '../services/student.service';

@Injectable({
  providedIn: 'root',
})
export class AssessmentAnswerResolver
  implements Resolve<AssessmentAnswerDTO | undefined> {
  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private assessmentService: ClassAssessmentService
  ) {}
  async resolve(
    route: ActivatedRouteSnapshot
  ): Promise<AssessmentAnswerDTO | undefined> {
    const courseId = route.params.courseId;
    const classId = route.params.classId;
    const assessmentId = route.params.assessmentId;
    const currentUser = this.authService.getCurrentUser();

    const student = await this.studentService
      .getStudentByUserId(currentUser?.id!)
      .toPromise();

    if (student == null) {
      return undefined;
    }

    const result = await this.assessmentService
      .getAssessmentResponse(courseId, classId, assessmentId, student.id)
      .toPromise();

    return result;
  }
}
