import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LessonsRoutingModule } from './lessons-routing.module';
import { LessonsDetailsComponent } from './lessons-details/lessons-details.component';
import { LessonsCreateComponent } from './lessons-create/lessons-create.component';

@NgModule({
  declarations: [LessonsDetailsComponent, LessonsCreateComponent],
  imports: [CommonModule, LessonsRoutingModule],
  exports: [LessonsDetailsComponent, LessonsCreateComponent],
})
export class LessonsModule {}
