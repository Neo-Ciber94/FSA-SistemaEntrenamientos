import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseRoutingModule } from './course-routing.module';
import { CoursesComponent } from './courses/courses.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { CourseCardComponent } from './course-card.component';

@NgModule({
  declarations: [CoursesComponent, CourseCardComponent],
  imports: [ComponentsModule, CommonModule, CourseRoutingModule],
})
export class CourseModule {}
