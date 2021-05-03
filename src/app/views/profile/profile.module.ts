import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { EditProfileComponent } from './edit-profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ComponentsModule } from 'src/app/components/components.module';
import { DeleteProfileComponent } from './delete-profile.component';

@NgModule({
  declarations: [
    ProfileComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    DeleteProfileComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    ComponentsModule,
    SweetAlert2Module.forChild(),
  ],
})
export class ProfileModule {}
