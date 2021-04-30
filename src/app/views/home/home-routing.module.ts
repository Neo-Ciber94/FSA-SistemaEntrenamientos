import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanLoginOrSignupGuard } from 'src/app/guards/can-login-or-signup.guard';
import { HomeComponent } from './home.component';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

// TODO:
// Student after login -> Courses
// Tutor after login -> Courses
// Admin after login -> Users

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    canActivate: [CanLoginOrSignupGuard],
    component: LogInComponent,
  },
  {
    path: 'signup',
    canActivate: [CanLoginOrSignupGuard],
    component: SignUpComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
