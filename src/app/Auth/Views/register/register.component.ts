import { Component } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';

  constructor(private authService: AuthService) { }

  onRegister() {
    if (this.email && this.password && this.firstName && this.lastName) {
      this.authService.register(this.email, this.password, this.firstName, this.lastName)
        .then(() => {
          console.log('Registro exitoso');
        })
        .catch(error => {
          console.error('Error en el registro:', error);
        });
    } else {
      console.error('Por favor, completa todos los campos');
    }
  }

}
