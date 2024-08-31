import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { User } from '../../Models/User.model';
import { UserService } from '../../services/users.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [MessageService, ConfirmationService],
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  items: MenuItem[] = [];
  activeItem: MenuItem = { label: '', icon: '' };
  userModal: boolean = false;

  uploadPercent: number | undefined;
  downloadURL: string | undefined;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService,
    private storage: AngularFireStorage,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.items = [
      { label: 'Usuarios', icon: 'fa-solid fa-users' },
      { label: 'Categorias', icon: 'fa-solid fa-tags' },
      { label: 'Roles', icon: 'fa-solid fa-users' },
    ];

    this.activeItem = this.items[0];
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      console.log(this.currentUser);
    });
  }

  onSelect(event: any): void {
    const file = event.files[0];
    console.log('Archivo seleccionado:', file);

    if (file && this.currentUser) {
      // Verifica que this.currentUser no sea null
      // Generar un nuevo nombre para el archivo
      const newFileName = `photo_${this.currentUser.uid}`;
      const filePath = `imgProfileUser/${newFileName}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // Monitorea el progreso de la carga
      task.percentageChanges().subscribe((percent) => {
        this.uploadPercent = percent || 0;
        console.log('Progreso de la subida:', this.uploadPercent);
      });

      // Obtén la URL de descarga cuando la carga se complete
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              this.downloadURL = url;
              this.userService
                .updateProfilePhotoUrl(this.currentUser!.uid, url)
                .then(() => {
                  console.log('Foto de perfil actualizada correctamente');
                })
                .catch((error) => {
                  console.error(
                    'Error al actualizar la foto de perfil:',
                    error
                  );
                });
              console.log('Archivo disponible en:', this.downloadURL);
            });
          })
        )
        .subscribe();
    } else {
      console.error(
        'No se seleccionó ningún archivo para subir o el usuario no está autenticado.'
      );
    }
  }

  onUpload(event: any): void {
    console.log('Evento onUpload disparado');
    const file = event.files[0];
    if (file) {
      console.log('Subiendo archivo:', file);
      const filePath = `images/${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.percentageChanges().subscribe((percent) => {
        this.uploadPercent = percent || 0;
        console.log('Progreso de la subida:', this.uploadPercent);
      });

      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              this.downloadURL = url;
              console.log('Archivo disponible en:', this.downloadURL);
            });
          })
        )
        .subscribe();
    } else {
      console.error('No se seleccionó ningún archivo para subir.');
    }
  }

  deletePhoto(): void {
    if (this.currentUser && this.currentUser.profilePhotoUrl) {
      // Eliminar la foto de Firebase Storage
      const filePath = `imgProfileUser/photo_${this.currentUser.uid}`; 
      const fileRef = this.storage.ref(filePath);
  
      fileRef.delete().subscribe(
        () => {
          console.log('Foto eliminada correctamente');
          // Actualizar la foto de perfil del usuario en la base de datos
          this.userService
            .updateProfilePhotoUrl(this.currentUser!.uid, '') // Limpia la URL en la base de datos
            .then(() => {
              this.downloadURL = ''; // Limpia la URL de la foto en la interfaz
              console.log('Foto de perfil eliminada correctamente');
            })
            .catch((error) => {
              console.error('Error al actualizar la foto de perfil:', error);
            });
        },
        (error) => {
          console.error('Error al eliminar la foto:', error);
        }
      );
    } else {
      console.error('El usuario no tiene una foto de perfil o no está autenticado.');
    }
  }
  

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }

  onLogout() {
    this.confirmationService.confirm({
      message: 'Esta seguro de Cerrar Sesión?',
      header: 'Cierre de sesión',
      icon: 'fa-solid fa-triangle-exclamation',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Aceptar',
      rejectLabel:'Cancelar',

      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Sesión cerrada correctamente',
        });
        this.authService.logout();
      },
    });
  }

  verModal() {
    this.userModal = true;
  }
}
