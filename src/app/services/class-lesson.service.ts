import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LessonDTO } from 'src/shared';
import { ApiService } from '.';

@Injectable({
  providedIn: 'root',
})
export class ClassLessonService {
  constructor(private apiService: ApiService) {}

  getAllLessons(courseId: number, classId: number) {
    return this.apiService.get<LessonDTO[]>(
      `courses/${courseId}/classes/${classId}/lesson`
    );
  }

  getLessonById(courseId: number, classId: number, lessonId: number) {
    return this.apiService.get<LessonDTO>(
      `courses/${courseId}/classes/${classId}/lesson/${lessonId}`
    );
  }

  createLesson(
    courseId: number,
    classId: number,
    lesson: Omit<LessonDTO, 'id'>
  ): Observable<LessonDTO> {
    return this.apiService.post(
      `courses/${courseId}/classes/${classId}/lesson`,
      lesson
    );
  }

  updateLesson(
    courseId: number,
    classId: number,
    lesson: LessonDTO
  ): Observable<LessonDTO> {
    return this.apiService.put(
      `courses/${courseId}/classes/${classId}/lesson`,
      lesson
    );
  }

  deleteLesson(
    courseId: number,
    classId: number,
    assessmentId: number
  ): Observable<LessonDTO> {
    return this.apiService.delete(
      `courses/${courseId}/classes/${classId}/lesson/${assessmentId}`
    );
  }
}
