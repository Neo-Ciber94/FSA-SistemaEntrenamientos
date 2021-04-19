import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassDetailsComponent } from './class-details/class-details.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { RouterModule } from '@angular/router';
import { ClassCreateComponent } from './class-create/class-create.component';
import { ClassesRoutingModule } from './classes-routing.module';

@NgModule({
  declarations: [ClassDetailsComponent, ClassCreateComponent],
  imports: [CommonModule, ComponentsModule, RouterModule, ClassesRoutingModule],
  exports: [ClassDetailsComponent, ClassCreateComponent],
})
export class ClassesModule {}
