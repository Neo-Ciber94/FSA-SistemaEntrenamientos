import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
    loadChildren: () =>
      import('./views/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'profile',
    resolve: {
      currentUser: CurrentUserResolver,
    },
    loadChildren: () =>
      import('./views/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'courses',
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
