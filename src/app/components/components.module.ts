import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from './card/card.component';
import { MultiChoiceComponent } from './multi-choice/multi-choice.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MultiChoiceBuilderComponent } from './multi-choice-builder/multi-choice-builder.component';

@NgModule({
  declarations: [CardComponent, MultiChoiceComponent, MultiChoiceBuilderComponent],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  exports: [CardComponent, MultiChoiceComponent],
})
export class ComponentsModule {}
