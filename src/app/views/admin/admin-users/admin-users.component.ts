import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { UserDTO } from 'src/shared';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
})
export class AdminUsersComponent implements OnInit, OnDestroy {
  users: UserDTO[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data;
      this.dtTrigger.next();
    });

    this.dtOptions = {
      pageLength: 6,
      info: false,
      lengthChange: false,
      scrollX: true,

      initComplete: () => {
        // prettier-ignore
        const element = document.querySelector('#table-container') as HTMLElement;
        element.style.opacity = '1';
      },
    };
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
