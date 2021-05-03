import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserDTO } from 'src/shared';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user!: UserDTO;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.parent!.data.subscribe((data) => {
      console.assert(data.user);
      this.user = data.user;
    });
  }

  canEdit() {
    return (
      this.authService.isCurrentUser(this.user) || this.authService.isAdmin()
    );
  }
}
