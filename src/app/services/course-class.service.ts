import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ClassTaskDTO,
  CourseClassDTO,
  CourseClassNew,
  TaskType,
} from 'src/shared';
import { ApiService } from './api.service';

interface ClassQueryOptions {
  includeTasks?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CourseClassService {
  constructor(private apiService: ApiService) {}

  getClasses(courseId: number, options: ClassQueryOptions = {}) {
    const params = getClassQueryParams(options);
    return this.apiService.get<CourseClassDTO[]>(
      `courses/${courseId}/classes`,
      { params }
    );
  }

  getClassById(
    courseId: number,
    classId: number,
    options: ClassQueryOptions = {}
  ) {
    const params = getClassQueryParams(options);
    return this.apiService.get<CourseClassDTO>(
      `courses/${courseId}/classes/${classId}`,
      { params }
    );
  }

  getTasks(courseId: number, classId: number, taskType?: TaskType) {
    if (taskType) {
      return this.apiService.get<ClassTaskDTO[]>(
        `courses/${courseId}/classes/${classId}/tasks?type=${taskType}`
      );
    }

    return this.apiService.get<ClassTaskDTO[]>(
      `courses/${courseId}/classes/${classId}/tasks`
    );
  }

  createClass(newClass: CourseClassNew): Observable<CourseClassDTO> {
    return this.apiService.post(
      `courses/${newClass.courseId}/classes`,
      newClass
    );
  }

  updateClass(newClass: CourseClassNew): Observable<CourseClassDTO> {
    return this.apiService.put(
      `courses/${newClass.courseId}/classes`,
      newClass
    );
  }

  deleteClass(courseId: number, classId: number): Observable<CourseClassDTO> {
    return this.apiService.delete(`courses/${courseId}/classes/${classId}`);
  }
}

function getClassQueryParams(options: ClassQueryOptions) {
  const include: string[] = ['course'];

  if (options.includeTasks) {
    include.push('tasks');
  }

  return new HttpParams({
    fromObject: {
      include: include.join(','),
    },
  });
}
