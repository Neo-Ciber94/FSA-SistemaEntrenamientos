import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LessonsRoutingModule } from './lessons-routing.module';
import { LessonsDetailsComponent } from './lessons-details/lessons-details.component';
import { LessonsCreateComponent } from './lessons-create/lessons-create.component';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [LessonsDetailsComponent, LessonsCreateComponent],
  imports: [
    CommonModule,
    LessonsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    MarkdownModule.forChild(),
  ],
  exports: [LessonsDetailsComponent, LessonsCreateComponent],
})
export class LessonsModule {}
