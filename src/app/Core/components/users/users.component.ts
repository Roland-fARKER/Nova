import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../Models/User.model';
import { UserService } from '../../services/users.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { Rol } from '../../Models/Rol.model';
import { RolService } from '../../services/rol.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [MessageService],
})
export class UsersComponent implements OnInit {
  @ViewChild('dt2') dt2!: Table;
  users: User[] = [];
  roles: Rol[] = [];

  superAdmin: boolean = false;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private rolService: RolService
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });

    this.rolService.getActiveRoles().subscribe((roles) => {
      this.roles = roles;
    });

    this.isSuper();
  }

  onFilterGlobal(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dt2.filterGlobal(input.value, 'contains');
  }

  // Guardar los cambios de una fila editada
  onRowEditSave(user: User) {
    this.userService
      .updateUser(user.uid, user)
      .then(() => {
        this.notification(
          'success',
          'Exito',
          'Se actualizó correctamente el usuario.'
        );
      })
      .catch((error) => {
        this.notification(
          'error',
          'Error al actualizar',
          error
        );
      });
    console.log('Row edit saved', user);
  }

  // Cancelar la edición de una fila
  onRowEditCancel(user: User, index: number) {
    this.notification(
      'warn',
      'Cancelado',
      'Se canselo la edición.'
    );
    console.log('Row edit cancelled', user, index);
  }

  notification(severity: string, sumary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: sumary,
      detail: detail,
    });
  }

  isSuper() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.userService
        .isSuperAdmin(user.uid)
        .subscribe((isSuperAdmin) => {
          this.superAdmin = isSuperAdmin;
        });
    }
  }
}
