import { Injectable } from '@angular/core';
import { CourseDTO, RoleName, UserDTO } from 'src/shared';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(private authService: AuthService) {}

  canWrite(course: CourseDTO, user?: UserDTO) {
    user = user ?? this.authService.getCurrentUser();
    if (user == null) {
      return false;
    }

    switch (user.role) {
      case RoleName.Admin:
        return true;
      case RoleName.Teacher:
        return user.id === course.teacherId;
      case RoleName.Student:
        return false;
    }
  }
}
