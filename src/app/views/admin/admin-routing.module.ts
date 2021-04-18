import { NgModule } from '@angular/core';
import {
  Route,
  RouterModule,
  Routes,
  UrlMatcher,
  UrlMatchResult,
  UrlSegment,
  UrlSegmentGroup,
} from '@angular/router';
import { AdminCoursesComponent } from './admin-courses/admin-courses.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminGuard } from './admin.guard';
import { adminCoursesUrlMatcher } from './adminCoursesUrlMatcher';

const routes: Routes = [
  {
    path: 'users',
    canActivate: [AdminGuard],
    component: AdminUsersComponent,
  },
  {
    path: 'courses',
    matcher: adminCoursesUrlMatcher,
    component: AdminCoursesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
