import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, NotFoundComponent],
  imports: [CommonModule, RouterModule],
  exports: [HeaderComponent, FooterComponent, NotFoundComponent],
})
export class SharedModule {}
