import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseClassDTO, AssessmentDTO, CourseClassNew } from 'src/shared';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CourseClassService {
  constructor(private apiService: ApiService) {}

  getClasses(courseId: number) {
    return this.apiService.get<CourseClassDTO[]>(`courses/${courseId}/classes`);
  }

  getClassById(courseId: number, classId: number) {
    return this.apiService.get<CourseClassDTO>(
      `courses/${courseId}/classes/${classId}`
    );
  }

  createClass(newClass: CourseClassNew): Observable<CourseClassDTO> {
    return this.apiService.post(
      `courses/${newClass.courseId}/classes`,
      newClass
    );
  }

  updateClass(newClass: CourseClassNew): Observable<CourseClassDTO> {
    return this.apiService.put(
      `courses/${newClass.courseId}/classes`,
      newClass
    );
  }

  deleteClass(courseId: number, classId: number): Observable<CourseClassDTO> {
    return this.apiService.delete(`courses/${courseId}/classes/${classId}`);
  }
}
