import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassDetailsComponent } from './class-details/class-details.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { CoursesComponent } from './courses/courses.component';

const routes: Routes = [
  {
    path: '',
    component: CoursesComponent,
  },
  {
    path: ':course_id',
    component: CourseDetailsComponent,
  },
  {
    path: ':course_id/classes/:class_id',
    component: ClassDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseRoutingModule {}
