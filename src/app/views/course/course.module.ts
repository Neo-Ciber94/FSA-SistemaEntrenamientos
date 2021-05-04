import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseRoutingModule } from './course-routing.module';
import { CoursesComponent } from './courses/courses.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { CourseCreateComponent } from './course-create/course-create.component';
import { ClassesModule } from '../classes/classes.module';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CoursesComponent,
    CourseDetailsComponent,
    CourseCreateComponent,
  ],
  imports: [
    ComponentsModule,
    CommonModule,
    CourseRoutingModule,
    RouterModule,
    DirectivesModule,
    NgbModule,
    FormsModule,
  ],
})
export class CourseModule {}
