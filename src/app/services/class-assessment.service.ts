import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssessmentDTO } from 'src/shared';
import { ApiService } from '.';

@Injectable({
  providedIn: 'root',
})
export class ClassAssessmentService {
  constructor(private apiService: ApiService) {}

  getAllAssessments(courseId: number, classId: number) {
    return this.apiService.get<AssessmentDTO[]>(
      `courses/${courseId}/classes/${classId}/assessment`
    );
  }

  getAssessmentById(courseId: number, classId: number, assessmentId: number) {
    return this.apiService.get<AssessmentDTO>(
      `courses/${courseId}/classes/${classId}/assessment/${assessmentId}`
    );
  }

  createAssessment(
    courseId: number,
    classId: number,
    assessment: Omit<AssessmentDTO, 'id'>
  ): Observable<AssessmentDTO> {
    return this.apiService.post(
      `courses/${courseId}/classes/${classId}/assessment`,
      assessment
    );
  }

  updateAssessment(
    courseId: number,
    classId: number,
    assessment: AssessmentDTO
  ): Observable<AssessmentDTO> {
    return this.apiService.put(
      `courses/${courseId}/classes/${classId}/assessment`,
      assessment
    );
  }

  deleteAssessment(
    courseId: number,
    classId: number,
    assessmentId: number
  ): Observable<AssessmentDTO> {
    return this.apiService.delete(
      `courses/${courseId}/classes/${classId}/assessment/${assessmentId}`
    );
  }
}
