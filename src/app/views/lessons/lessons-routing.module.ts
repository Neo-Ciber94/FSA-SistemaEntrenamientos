import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanNotLoadGuard } from 'src/app/guards/can-not-load.guard';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { LessonResolver } from 'src/app/resolvers/lesson.resolver';
import { LessonsCreateComponent } from './lessons-create/lessons-create.component';
import { LessonsDetailsComponent } from './lessons-details/lessons-details.component';

const lessonResolver = {
  lesson: LessonResolver,
};

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [CanNotLoadGuard],
  },
  {
    path: 'new',
    canActivate: [PermissionGuard],
    component: LessonsCreateComponent,
  },
  {
    path: ':lessonId',
    resolve: lessonResolver,
    component: LessonsDetailsComponent,
  },
  {
    path: ':lessonId/edit',
    resolve: lessonResolver,
    canActivate: [PermissionGuard],
    component: LessonsCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonsRoutingModule {}
