import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  uploadPercent: Observable<number | undefined> | undefined = undefined;
  downloadURL: string | undefined;

  constructor(
    private authService: AuthService,
    private storage: AngularFireStorage,
    private router: Router,
    private messageService: MessageService
  ) {}

  login() {
    if (!this.email || !this.password) {
      this.messageService.add({severity:'error', summary:'Error', detail: 'Correo y contraseña son requeridos'});
      return;
    }

    this.authService.login(this.email, this.password)
      .then(() => {
        this.messageService.add({severity:'success', summary:'Éxito', detail: 'Login exitoso'});
        this.router.navigate(['/Home']);  // Redirigir a la ruta 'Home' en caso de éxito
      })
      .catch(error => {
        console.error('Error en el login:', error);
        let errorMessage = 'Error desconocido. Por favor, intente nuevamente.';
        
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          errorMessage = 'Correo o contraseña incorrectos';
        }
        
        this.messageService.add({severity:'error', summary:'Error', detail: errorMessage});
      });
  }

  uploadFile(event: any) {
    const file = event.target.files[0];
    const filePath = `uploads/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // Observa el porcentaje de subida
    this.uploadPercent = task.percentageChanges();

    // Obtén el enlace de descarga cuando el archivo esté disponible
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.downloadURL = url;
          });
        })
      )
      .subscribe();
  }
}
