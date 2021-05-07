import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LessonDTO, LessonNew } from 'src/shared';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ClassLessonService {
  constructor(private apiService: ApiService) {}

  getAllLessons(courseId: number, classId: number) {
    return this.apiService.get<LessonDTO[]>(
      `courses/${courseId}/classes/${classId}/lessons`
    );
  }

  getLessonById(courseId: number, classId: number, lessonId: number) {
    return this.apiService.get<LessonDTO>(
      `courses/${courseId}/classes/${classId}/lessons/${lessonId}`
    );
  }

  createLesson(
    courseId: number,
    classId: number,
    lesson: LessonNew
  ): Observable<LessonNew> {
    return this.apiService.post(
      `courses/${courseId}/classes/${classId}/lessons`,
      lesson
    );
  }

  updateLesson(
    courseId: number,
    classId: number,
    lesson: LessonNew
  ): Observable<LessonNew> {
    return this.apiService.put(
      `courses/${courseId}/classes/${classId}/lessons`,
      lesson
    );
  }

  deleteLesson(
    courseId: number,
    classId: number,
    assessmentId: number
  ): Observable<LessonDTO> {
    return this.apiService.delete(
      `courses/${courseId}/classes/${classId}/lessons/${assessmentId}`
    );
  }
}
