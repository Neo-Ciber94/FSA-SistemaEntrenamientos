import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './layout/footer.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    FooterComponent,
    HomeComponent,
    NotFoundComponent
  ],
  imports: [CommonModule, RouterModule],
})
export class SharedModule {}
