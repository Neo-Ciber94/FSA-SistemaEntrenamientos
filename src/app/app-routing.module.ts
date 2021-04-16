import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './views/shared/not-found/not-found.component';
import { EditProfileComponent } from './views/user/edit-profile/edit-profile.component';
import { ProfileComponent } from './views/user/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./views/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'users',
    // TODO: Check is login
    loadChildren: () =>
      import('./views/user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'profile/edit',
    component: EditProfileComponent,
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
