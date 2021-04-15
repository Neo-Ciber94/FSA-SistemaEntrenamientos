import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { EditProfileComponent } from './user/edit-profile/edit-profile.component';
import { ProfileComponent } from './user/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'users',
    // TODO: Check is login
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
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
      import('./course/course.module').then((m) => m.CourseModule),
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
