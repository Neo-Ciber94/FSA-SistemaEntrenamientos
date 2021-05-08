import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
} from '@angular/router';
import { RoleName } from 'src/shared';
import { AuthService } from '../services/auth.service';
import { CourseService } from '../services/course.service';
import { PermissionService } from '../services/permission.service';
import { RedirectService } from '../services/redirect.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  constructor(
    private redirectService: RedirectService,
    private courseService: CourseService,
    private permissionService: PermissionService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const courseId = route.params.courseId;
    const course = await this.courseService.getCourseById(courseId).toPromise();
    if (this.permissionService.canWrite(course)) {
      return true;
    }

    await this.redirectService.navigateTo404();
    return false;
  }
}
