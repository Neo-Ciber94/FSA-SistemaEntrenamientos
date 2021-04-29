import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { EditProfileComponent } from './edit-profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password.component';

@NgModule({
  declarations: [ProfileComponent, EditProfileComponent, ChangePasswordComponent],
  imports: [CommonModule, ProfileRoutingModule, NgbModule, ReactiveFormsModule],
})
export class ProfileModule {}
