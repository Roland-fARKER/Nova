import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../Models/User.model';
import { UserService } from '../../services/users.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  @ViewChild('dt2') dt2!: Table;
  users: User[] = [];
  selectedUser?: User;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }


  onFilterGlobal(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dt2.filterGlobal(input.value, 'contains');
  }

}
