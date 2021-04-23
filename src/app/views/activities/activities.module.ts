import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivitiesRoutingModule } from './activities-routing.module';
import { ActivityCreateComponent } from './activity-create/activity-create.component';
import { ActivityDetailsComponent } from './activity-details/activity-details.component';

@NgModule({
  declarations: [ActivityCreateComponent, ActivityDetailsComponent],
  imports: [CommonModule, ActivitiesRoutingModule],
  exports: [ActivityCreateComponent, ActivityDetailsComponent],
})
export class ActivitiesModule {}
