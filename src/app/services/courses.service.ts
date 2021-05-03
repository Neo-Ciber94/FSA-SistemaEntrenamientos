import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseDTO } from 'src/shared';
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
export class CoursesService {
  private readonly courseRoute = 'courses';
  constructor(private apiService: ApiService) {}

  getAllCourses() {
    return this.apiService.get<CourseDTO[]>(this.courseRoute);
  }

  getCourseById(id: number) {
    return this.apiService.get<CourseDTO | undefined>(
      `${this.courseRoute}/${id}`
    );
  }

  createCourse(course: Omit<CourseDTO, 'id'>): Observable<CourseDTO> {
    return this.apiService.post(this.courseRoute, course);
  }

  updateCourses(course: CourseDTO): Observable<CourseDTO> {
    return this.apiService.put(this.courseRoute, course);
  }

  deleteCourse(id: number): Observable<CourseDTO> {
    return this.apiService.delete(`${this.courseRoute}/${id}`);
  }
}
