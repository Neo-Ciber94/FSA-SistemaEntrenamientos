import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CourseDTO } from 'src/shared';
import { CourseService } from '../services/course.service';
import { RedirectService } from '../services/redirect.service';

@Injectable({
  providedIn: 'root',
})
export class CourseResolver implements Resolve<CourseDTO> {
  constructor(
    private redirectService: RedirectService,
    private courseService: CourseService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<CourseDTO> {
    const id = route.params.id;
    if (id) {
      return this.courseService.getCourseById(id);
    } else {
      return this.redirectService.navigateTo404() as never;
    }
  }
}
