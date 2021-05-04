import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AssessmentDTO,
  CourseClassDTO,
  CourseDTO,
  CourseNew,
} from 'src/shared';
import { ApiService } from './api.service';

type CourseOptions = {
  includeClasses?: boolean;
  includeStudents?: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private apiService: ApiService) {}

  getAllCourses(userId?: number, options: CourseOptions = {}) {
    const params = courseQueryParams({ ...options, userId });

    if (userId) {
      return this.apiService.get<CourseDTO[]>(`courses?user=${userId}`, {
        params,
      });
    }

    return this.apiService.get<CourseDTO[]>('courses', { params });
  }

  getCourseById(id: number, options: CourseOptions = {}) {
    const params = courseQueryParams(options);
    return this.apiService.get<CourseDTO>(`courses/${id}`, { params });
  }

  createCourse(course: CourseNew): Observable<CourseDTO> {
    return this.apiService.post('courses', course);
  }

  updateCourse(course: CourseNew): Observable<CourseDTO> {
    return this.apiService.put('courses', course);
  }

  deleteCourse(id: number): Observable<CourseDTO> {
    return this.apiService.delete(`courses/${id}`);
  }
}

function courseQueryParams(options: CourseOptions & { userId?: number }) {
  let params = new HttpParams();

  if (options.userId) {
    params = params.append('user', options.userId.toString());
  }

  const includes: string[] = ['teacher'];

  if (options.includeClasses) {
    includes.push('classes');
  }

  if (options.includeStudents) {
    includes.push('students');
  }

  if (includes.length > 0) {
    params = params.append('include', includes.join(','));
  }

  return params;
}
