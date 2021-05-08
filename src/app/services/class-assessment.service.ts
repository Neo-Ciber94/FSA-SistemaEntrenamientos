import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssessmentDTO, AssessmentNew } from 'src/shared';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ClassAssessmentService {
  constructor(private apiService: ApiService) {}

  getAllAssessments(courseId: number, classId: number) {
    return this.apiService.get<AssessmentDTO[]>(
      `courses/${courseId}/classes/${classId}/assessments`
    );
  }

  getAssessmentById(courseId: number, classId: number, assessmentId: number) {
    return this.apiService.get<AssessmentDTO>(
      `courses/${courseId}/classes/${classId}/assessments/${assessmentId}`
    );
  }

  createAssessment(
    courseId: number,
    classId: number,
    assessment: AssessmentNew
  ): Observable<AssessmentDTO> {
    return this.apiService.post(
      `courses/${courseId}/classes/${classId}/assessments`,
      assessment
    );
  }

  updateAssessment(
    courseId: number,
    classId: number,
    assessment: AssessmentNew
  ): Observable<AssessmentDTO> {
    return this.apiService.put(
      `courses/${courseId}/classes/${classId}/assessments`,
      assessment
    );
  }

  deleteAssessment(
    courseId: number,
    classId: number,
    assessmentId: number
  ): Observable<AssessmentDTO> {
    return this.apiService.delete(
      `courses/${courseId}/classes/${classId}/assessments/${assessmentId}`
    );
  }
}
