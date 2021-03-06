import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { CourseResolver } from 'src/app/resolvers/course.resolver';
import { AdminCoursesComponent } from '../admin/admin-courses/admin-courses.component';
import { adminCoursesUrlMatcher } from './adminCoursesUrlMatcher';
import { CourseCreateComponent } from './course-create/course-create.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { CoursesComponent } from './courses/courses.component';

const courseResolver = {
  course: CourseResolver,
};

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
    path: ':courseId/edit',
    resolve: courseResolver,
    component: CourseCreateComponent,
  },
  {
    path: ':courseId/classes',
    resolve: courseResolver,
    loadChildren: () =>
      import('../classes/classes.module').then((m) => m.ClassesModule),
  },
  {
    path: ':courseId',
    resolve: courseResolver,
    component: CourseDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseRoutingModule {}
