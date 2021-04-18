import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { EditProfileComponent } from './edit-profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ProfileComponent, EditProfileComponent],
  imports: [CommonModule, ProfileRoutingModule, NgbModule],
})
export class ProfileModule {}