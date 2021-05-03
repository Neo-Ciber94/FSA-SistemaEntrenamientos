import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { UserDTO } from 'src/shared';

@Component({
  selector: 'app-delete-profile',
  templateUrl: './delete-profile.component.html',
  styleUrls: ['./delete-profile.component.css'],
})
export class DeleteProfileComponent implements OnInit {
  user!: UserDTO;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.assert(data.user);
      this.user = data.user;
    });
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  back() {
    this.location.back();
  }

  async delete() {
    await this.authService.delete(this.user.id).toPromise();
    await this.router.navigateByUrl('/');
  }
}
