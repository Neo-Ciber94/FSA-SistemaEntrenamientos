import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoleName } from 'src/shared';
import { AuthService } from '../services/auth.service';
import { RedirectService } from '../services/redirect.service';
import { StudentService } from '../services/student.service';

@Injectable({
  providedIn: 'root',
})
export class IsStudentGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private redirectService: RedirectService
  ) {}

  async canActivate(): Promise<boolean> {
    const user = this.authService.getCurrentUser();
    if (user?.role === RoleName.Student) {
      const student = await this.studentService
        .getStudentByUserId(user?.id!)
        .toPromise();

      if (student) {
        return true;
      } else {
        return this.redirectService.navigateTo404() as never;
      }
    }

    return true;
  }
}
