import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseRoutingModule } from './course-routing.module';
import { CoursesComponent } from './courses/courses.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { CourseCardComponent } from './course-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { CourseClassCardComponent } from './course-class-card/course-class-card.component';
import { ClassDetailsComponent } from './class-details/class-details.component';

@NgModule({
  declarations: [
    CoursesComponent,
    CourseCardComponent,
    CourseDetailsComponent,
    CourseClassCardComponent,
    ClassDetailsComponent,
  ],
  imports: [ComponentsModule, CommonModule, CourseRoutingModule, NgbModule],
})
export class CourseModule {}
