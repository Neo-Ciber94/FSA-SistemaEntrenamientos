import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminCoursesComponent } from './admin-courses/admin-courses.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { DataTablesModule } from 'angular-datatables';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  declarations: [AdminCoursesComponent, AdminUsersComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    DataTablesModule,
    DirectivesModule,
  ],
  exports: [AdminCoursesComponent, AdminUsersComponent],
})
export class AdminModule {}
