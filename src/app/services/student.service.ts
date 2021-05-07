import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseStudentDTO } from 'src/shared';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private apiService: ApiService) {}

  getAllStudents(courseId?: number) {
    if (courseId) {
      return this.apiService.get<CourseStudentDTO[]>(
        `courses/students?course=${courseId}`
      );
    }

    return this.apiService.get<CourseStudentDTO[]>(`courses/students`);
  }

  getStudentById(studentId: number) {
    return this.apiService.get<CourseStudentDTO>(
      `courses/students/${studentId}`
    );
  }

  getStudentByUserId(userId: number) {
    return this.apiService.get<CourseStudentDTO>(
      `courses/students/user/${userId}`
    );
  }

  addStudent(
    courseId: number,
    user: { userId: number }
  ): Observable<CourseStudentDTO> {
    return this.apiService.post(`courses/${courseId}/students`, user);
  }

  deleteStudent(studentId: number) {
    return this.apiService.delete<CourseStudentDTO>(
      `courses/students/${studentId}`
    );
  }
}
