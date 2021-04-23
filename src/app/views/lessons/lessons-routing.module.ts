import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanNotLoadGuard } from 'src/app/guards/can-not-load.guard';
import { LessonsCreateComponent } from './lessons-create/lessons-create.component';
import { LessonsDetailsComponent } from './lessons-details/lessons-details.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [CanNotLoadGuard],
  },
  {
    path: 'new',
    component: LessonsCreateComponent,
  },
  {
    path: ':id',
    component: LessonsDetailsComponent,
  },
  {
    path: ':id/edit',
    component: LessonsCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonsRoutingModule {}
