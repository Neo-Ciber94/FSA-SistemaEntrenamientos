import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCoursesComponent } from '../admin/admin-courses/admin-courses.component';
import { ClassDetailsComponent } from '../classes/class-details/class-details.component';
import { adminCoursesUrlMatcher } from './adminCoursesUrlMatcher';
import { CourseCreateComponent } from './course-create/course-create.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { CoursesComponent } from './courses/courses.component';

const routes: Routes = [
  {
    matcher: adminCoursesUrlMatcher,
    component: AdminCoursesComponent,
  },
  {
    path: '',
    component: CoursesComponent,
  },
  {
    path: 'new',
    component: CourseCreateComponent,
  },
  {
    path: ':course_id/edit',
    component: CourseCreateComponent,
  },
  {
    path: ':course_id',
    component: CourseDetailsComponent,
  },
  {
    path: ':course_id/classes/:class_id',
    component: ClassDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseRoutingModule {}
