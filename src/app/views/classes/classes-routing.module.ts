import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanNotLoadGuard } from 'src/app/guards/can-not-load.guard';
import { ClassCreateComponent } from './class-create/class-create.component';
import { ClassDetailsComponent } from './class-details/class-details.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [CanNotLoadGuard],
  },
  {
    path: 'new',
    component: ClassCreateComponent,
  },
  {
    path: ':id',
    component: ClassDetailsComponent,
  },
  {
    path: ':id/edit',
    component: ClassCreateComponent,
  },
  {
    path: ':id/lessons',
    loadChildren: () =>
      import('../lessons/lessons.module').then((m) => m.LessonsModule),
  },
  {
    path: ':id/assessments',
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
