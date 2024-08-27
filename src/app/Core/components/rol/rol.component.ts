import { Component, OnInit, ViewChild } from '@angular/core';

import { Rol, RolService } from '../../services/rol.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrl: './rol.component.css',
})
export class RolComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  rol: Rol[] = [];
  selectedRol: Rol = { name: '', state: true, id: '' }; // Inicializa con valores predeterminados
  displayDialog: boolean = false;
  isEdit: boolean = false;

  constructor(private rolService: RolService, private messageService: MessageService, private confirmacion: ConfirmationService) { }

  ngOnInit(): void {
    this.loadRol();
  }

  loadRol(): void {
    this.rolService.getRol().subscribe(rol => this.rol = rol);
  }

  openDialog(rol?: Rol): void {
    if (rol) {
      this.selectedRol = { ...rol };
      this.isEdit = true;
    } else {
      this.selectedRol = { name: '', state: true, id: '' }; // Inicializa un nuevo objeto para creación
      this.isEdit = false;
    }
    this.displayDialog = true;
  }

  saveRol(): void {
    if (!this.selectedRol.name || this.selectedRol.name.trim() === '') {
      this.messageService.add({ severity: 'warn', summary: 'Validation Error', detail: 'Rol name is required' });
      return;
    }

    if (this.isEdit) {
      this.rolService.updateRol(this.selectedRol.id!, this.selectedRol).then(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'rol updated' });
        this.loadRol();
        this.displayDialog = false;
      });
    } else {
      this.rolService.createRol(this.selectedRol).then(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Rol created' });
        this.loadRol();
        this.displayDialog = false;
      });
    }
  }

  deleteRol(id: string, name: string): void {
    this.confirmacion.confirm({
      message: `<strong style="text-align: center;" >${name}</strong> `,
      header: 'Esta seguro de eliminar este registro? ',
      icon: 'fa-solid fa-trash',
      acceptButtonStyleClass: 'p-button-text p-button-text',
      rejectButtonStyleClass: 'p-button-danger p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',

      accept: () => {
        this.rolService.deleteRol(id).then(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Rol deleted' });
          this.loadRol();
        });
      }
    })
  }

  onGlobalFilter(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && this.dt) {
      this.dt.filterGlobal(inputElement.value, 'contains');
    }
  }
}
