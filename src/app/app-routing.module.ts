import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsLoggedGuard } from './guards';
import { CurrentUserResolver } from './resolvers/current-user.resolver';
import { NotFoundComponent } from './views/shared/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./views/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: '',
    canActivate: [IsLoggedGuard],
    loadChildren: () =>
      import('./views/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'profile',
    canActivate: [IsLoggedGuard],
    resolve: { currentUser: CurrentUserResolver },
    loadChildren: () =>
      import('./views/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'courses',
    canActivate: [IsLoggedGuard],
    loadChildren: () =>
      import('./views/course/course.module').then((m) => m.CourseModule),
  },
  {
    path: '**',

    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
