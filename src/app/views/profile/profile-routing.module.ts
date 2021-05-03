import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanEditProfileGuard } from 'src/app/guards/can-edit-profile.guard';
import { ChangePasswordComponent } from './change-password.component';
import { DeleteProfileComponent } from './delete-profile.component';
import { EditProfileComponent } from './edit-profile.component';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
  },
  {
    path: 'edit',
    canActivate: [CanEditProfileGuard],
    component: EditProfileComponent,
  },
  {
    path: 'changepassword',
    canActivate: [CanEditProfileGuard],
    component: ChangePasswordComponent,
  },
  {
    path: 'delete',
    canActivate: [CanEditProfileGuard],
    component: DeleteProfileComponent,
  },
  {
    path: ':id',
    component: ProfileComponent,
  },
  {
    path: ':id/edit',
    canActivate: [CanEditProfileGuard],
    component: EditProfileComponent,
  },
  {
    path: ':id/changepassword',
    canActivate: [CanEditProfileGuard],
    component: ChangePasswordComponent,
  },
  {
    path: ':id/delete',
    canActivate: [CanEditProfileGuard],
    component: DeleteProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
