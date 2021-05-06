import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CourseClassDTO } from 'src/shared';
import { CourseClassService } from '../services/course-class.service';
import { RedirectService } from '../services/redirect.service';

@Injectable({
  providedIn: 'root',
})
export class ClassResolver implements Resolve<CourseClassDTO> {
  constructor(
    private redirectService: RedirectService,
    private classService: CourseClassService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<CourseClassDTO> {
    const courseId = route.params.courseId;
    const classId = route.params.classId;

    if (courseId && classId) {
      return this.classService.getClassById(courseId, classId).toPromise();
    } else {
      return this.redirectService.navigateTo404() as never;
    }
  }
}
