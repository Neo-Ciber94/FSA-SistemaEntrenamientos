import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminCoursesComponent } from './admin-courses/admin-courses.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';

@NgModule({
  declarations: [
    AdminCoursesComponent,
    AdminUsersComponent
  ],
  imports: [CommonModule, AdminRoutingModule],
  exports: [
    AdminCoursesComponent,
    AdminUsersComponent
  ],
})
export class AdminModule {}
