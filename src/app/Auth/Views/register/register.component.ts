import { Component } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [MessageService]
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';

  constructor(private authService: AuthService, private messageService: MessageService, private router: Router) { }

  onRegister() {
    if (this.email && this.password && this.firstName && this.lastName) {
      this.authService.register(this.email, this.password, this.firstName, this.lastName)
        .then(() => {
          console.log('Registro exitoso');
          this.messageService.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'Registro exitoso, vallamos al login'
          });
          this.resetInputs()
        })
        .catch(error => {
          console.error('Error en el registro:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Ocurrio un error',
            detail: 'Ha ocurrido un error desconocido'
          });
        });
    } else {
      console.error('Por favor, completa todos los campos');
      this.messageService.add({
        severity: 'error',
        summary: 'Ocurrio un error',
        detail: 'Necesita completar todos los campos'
      });
    }
  }

  resetInputs() {
    this.email = ''
    this.firstName = ''
    this.email = ''
    this.password = ''
  }

  alLogin() {
    this.router.navigate(['/Login']);
  }
}
