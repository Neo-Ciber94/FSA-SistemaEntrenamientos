import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password.component';
import { EditProfileComponent } from './edit-profile.component';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
  },
  {
    path: 'edit',
    component: EditProfileComponent,
  },
  {
    path: 'changepassword',
    component: ChangePasswordComponent,
  },
  {
    path: ':id',
    component: ProfileComponent,
  },
  {
    path: ':id/edit',
    component: EditProfileComponent,
  },
  {
    path: ':id/changepassword',
    component: ChangePasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
