import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RoleName } from 'src/shared';

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
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}
