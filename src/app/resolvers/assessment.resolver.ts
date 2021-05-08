import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { from, Observable } from 'rxjs';
import { AssessmentDTO, RoleName } from 'src/shared';
import { AuthService } from '../services/auth.service';
import { ClassAssessmentService } from '../services/class-assessment.service';
import { RedirectService } from '../services/redirect.service';

@Injectable({
  providedIn: 'root',
})
export class AssessmentResolver implements Resolve<AssessmentDTO> {
  constructor(
    private assessmentService: ClassAssessmentService,
    private redirectService: RedirectService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<AssessmentDTO> {
    const courseId = route.params.courseId;
    const classId = route.params.classId;
    const assessmentId = route.params.assessmentId;

    if (courseId && classId && assessmentId) {
      return this.assessmentService.getAssessmentById(
        courseId,
        classId,
        assessmentId
      );
    } else {
      return from(this.redirectService.navigateTo404()) as never;
    }
  }
}
