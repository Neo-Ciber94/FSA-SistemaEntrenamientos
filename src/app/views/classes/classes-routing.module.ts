import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanNotLoadGuard } from 'src/app/guards/can-not-load.guard';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { ClassResolver } from 'src/app/resolvers/class.resolver';
import { ClassCreateComponent } from './class-create/class-create.component';
import { ClassDetailsComponent } from './class-details/class-details.component';

const classResolver = {
  courseClass: ClassResolver,
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
    component: ClassCreateComponent,
  },
  {
    path: ':classId',
    resolve: classResolver,
    component: ClassDetailsComponent,
  },
  {
    path: ':classId/edit',
    resolve: classResolver,
    canActivate: [PermissionGuard],
    component: ClassCreateComponent,
  },
  {
    path: ':classId/lessons',
    resolve: classResolver,
    loadChildren: () =>
      import('../lessons/lessons.module').then((m) => m.LessonsModule),
  },
  {
    path: ':classId/assessments',
    resolve: classResolver,
    loadChildren: () =>
      import('../assessments/assessments.module').then(
        (m) => m.AssessmentsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassesRoutingModule {}
