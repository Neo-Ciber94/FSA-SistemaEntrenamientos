import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassCreateComponent } from './class-create/class-create.component';
import { ClassDetailsComponent } from './class-details/class-details.component';

const routes: Routes = [
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassesRoutingModule {}
