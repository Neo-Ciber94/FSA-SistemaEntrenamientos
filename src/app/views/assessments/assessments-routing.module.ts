import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanNotLoadGuard } from 'src/app/guards/can-not-load.guard';
import { AssessmentCreateComponent } from './assessment-create/assessment-create.component';
import { AssessmentDetailsComponent } from './assessment-details/assessment-details.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [CanNotLoadGuard],
  },
  {
    path: 'new',
    component: AssessmentCreateComponent,
  },
  {
    path: ':id',
    component: AssessmentDetailsComponent,
  },
  {
    path: ':id/edit',
    component: AssessmentCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssessmentsRoutingModule {}
