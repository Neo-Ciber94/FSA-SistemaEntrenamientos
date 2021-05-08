import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanNotLoadGuard } from 'src/app/guards/can-not-load.guard';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { AssessmentAnswerResolver } from 'src/app/resolvers/assessment-answer.resolver';
import { AssessmentResolver } from 'src/app/resolvers/assessment.resolver';
import { AssessmentCreateComponent } from './assessment-create/assessment-create.component';
import { AssessmentDetailsComponent } from './assessment-details/assessment-details.component';

const assessmentResolver = {
  assessment: AssessmentResolver,
  assessmentAnswer: AssessmentAnswerResolver,
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
    component: AssessmentCreateComponent,
  },
  {
    path: ':assessmentId',
    resolve: assessmentResolver,
    component: AssessmentDetailsComponent,
  },
  {
    path: ':assessmentId/edit',
    resolve: assessmentResolver,
    canActivate: [PermissionGuard],
    component: AssessmentCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssessmentsRoutingModule {}
