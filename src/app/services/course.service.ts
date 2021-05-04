import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssessmentDTO, CourseClassDTO, CourseDTO } from 'src/shared';
import { ApiService } from './api.service';

// type CourseInclude = 'classes' | 'students';

// function getIncludes(include: CourseInclude[]) {
//   if (include.length === 0) {
//     return '';
//   }

//   return `?include=${include.join(',')}`;
// }

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private apiService: ApiService) {}

  getAllCourses(userId?: number) {
    if (userId) {
      return this.apiService.get<CourseDTO[]>(
        `courses?user=${userId}&include=teacher`
      );
    }
    return this.apiService.get<CourseDTO[]>('courses?include=teacher');
  }

  getCourseById(id: number) {
    return this.apiService.get<CourseDTO>(`courses/${id}`);
  }

  createCourse(
    course: Pick<CourseDTO, 'name' | 'description'>
  ): Observable<CourseDTO> {
    return this.apiService.post('courses', course);
  }

  updateCourse(
    course: Pick<CourseDTO, 'id' | 'name' | 'description'>
  ): Observable<CourseDTO> {
    return this.apiService.put('courses', course);
  }

  deleteCourse(id: number): Observable<CourseDTO> {
    return this.apiService.delete(`courses/${id}`);
  }
}
