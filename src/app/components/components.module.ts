import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from './card/card.component';
import { MultiChoiceComponent } from './multi-choice/multi-choice.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MultiChoiceBuilderComponent } from './multi-choice-builder/multi-choice-builder.component';
import { InputListComponent } from './input-list/input-list.component';

@NgModule({
  declarations: [
    CardComponent,
    MultiChoiceComponent,
    MultiChoiceBuilderComponent,
    InputListComponent,
  ],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  exports: [CardComponent, MultiChoiceComponent, MultiChoiceBuilderComponent, InputListComponent],
})
export class ComponentsModule {}
