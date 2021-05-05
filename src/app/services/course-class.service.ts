import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseClassDTO, CourseClassNew } from 'src/shared';
import { ApiService } from './api.service';

interface ClassQueryOptions {
  includeAssessmentss?: boolean;
  includeLessons?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CourseClassService {
  constructor(private apiService: ApiService) {}

  getClasses(courseId: number, options: ClassQueryOptions = {}) {
    const params = getClassQueryParams(options);
    return this.apiService.get<CourseClassDTO[]>(
      `courses/${courseId}/classes`,
      { params }
    );
  }

  getClassById(
    courseId: number,
    classId: number,
    options: ClassQueryOptions = {}
  ) {
    const params = getClassQueryParams(options);
    return this.apiService.get<CourseClassDTO>(
      `courses/${courseId}/classes/${classId}`,
      { params }
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

function getClassQueryParams(options: ClassQueryOptions) {
  const include: string[] = ['course'];

  if (options.includeAssessmentss) {
    include.push('assessments');
  }

  if (options.includeLessons) {
    include.push('lessons');
  }

  return new HttpParams({
    fromObject: {
      include: include.join(','),
    },
  });
}
