import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { Observable, of } from 'rxjs';  // Importa 'of' aquí
import { map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getUser().pipe(
      take(1),
      switchMap(user => {
        const token = this.authService.getToken();
        const storedUser = this.authService.getStoredUser();

        if (user && token && storedUser) {
          // Está logueado en Firebase y hay datos en el localStorage
          return of(true);
        } else {
          // No está logueado o falta información
          this.router.navigate(['/Login']);
          return of(false);
        }
      })
    );
  }
}
