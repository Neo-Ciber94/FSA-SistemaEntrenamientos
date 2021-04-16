import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseRoutingModule } from './course-routing.module';
import { CoursesComponent } from './courses/courses.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { CourseCardComponent } from './course-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CourseDetailsComponent } from './course-details/course-details.component';

@NgModule({
  declarations: [CoursesComponent, CourseCardComponent, CourseDetailsComponent],
  imports: [ComponentsModule, CommonModule, CourseRoutingModule, NgbModule],
})
export class CourseModule {}
