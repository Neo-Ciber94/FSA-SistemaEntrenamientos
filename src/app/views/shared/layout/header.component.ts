import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoleName } from 'src/app/models/RoleName';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  get role() {
    return this.authService.getCurrentUser()?.role;
  }

  get Roles() {
    return RoleName;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
