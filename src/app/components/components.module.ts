import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';
import { CardComponent } from './card/card.component';

@NgModule({
  declarations: [BreadcrumbComponent, CardComponent],
  imports: [CommonModule, RouterModule],
  exports: [BreadcrumbComponent, CardComponent],
})
export class ComponentsModule {}
