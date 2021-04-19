import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassDetailsComponent } from './class-details/class-details.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [ClassDetailsComponent],
  imports: [CommonModule, ComponentsModule],
  exports: [ClassDetailsComponent],
})
export class ClassesModule {}
