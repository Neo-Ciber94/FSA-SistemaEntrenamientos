import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: ':user_id',
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'profile/edit',
        component: EditProfileComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
