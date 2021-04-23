import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssessmentsRoutingModule } from './assessments-routing.module';
import { AssessmentDetailsComponent } from './assessment-details/assessment-details.component';
import { AssessmentCreateComponent } from './assessment-create/assessment-create.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [AssessmentDetailsComponent, AssessmentCreateComponent],
  imports: [CommonModule, AssessmentsRoutingModule, ComponentsModule],
  exports: [AssessmentDetailsComponent, AssessmentCreateComponent],
})
export class AssessmentsModule {}
