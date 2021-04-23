import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanNotLoadGuard } from 'src/app/guards/can-not-load.guard';
import { ActivityCreateComponent } from './activity-create/activity-create.component';
import { ActivityDetailsComponent } from './activity-details/activity-details.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [CanNotLoadGuard],
  },
  {
    path: 'new',
    component: ActivityCreateComponent,
  },
  {
    path: ':id',
    component: ActivityDetailsComponent,
  },
  {
    path: ':id/edit',
    component: ActivityCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitiesRoutingModule {}
