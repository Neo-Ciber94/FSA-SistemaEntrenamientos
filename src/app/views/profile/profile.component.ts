import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserDTO } from 'src/shared';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  readonly user: UserDTO;

  constructor(authService: AuthService) {
    this.user = authService.getCurrentUser()!;
  }

  canEdit() {
    return false; // TODO: Check if the user can edit this profile
  }
}
