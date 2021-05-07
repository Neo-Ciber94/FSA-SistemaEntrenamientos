import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { from, Observable } from 'rxjs';
import { LessonDTO } from 'src/shared';
import { ClassLessonService } from '../services/class-lesson.service';
import { RedirectService } from '../services/redirect.service';

@Injectable({
  providedIn: 'root',
})
export class LessonResolver implements Resolve<LessonDTO> {
  constructor(
    private redirectService: RedirectService,
    private lessonService: ClassLessonService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<LessonDTO> {
    const courseId = route.params.courseId;
    const courseClassId = route.params.classId;
    const lessonId = route.params.lessonId;

    if (courseId && courseClassId && lessonId) {
      return this.lessonService.getLessonById(
        courseId,
        courseClassId,
        lessonId
      );
    } else {
      // Safety: convert the promise to observable
      return from(this.redirectService.navigateTo404()) as never;
    }
  }
}
