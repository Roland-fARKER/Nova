import { RouterModule, Routes, CanActivate } from '@angular/router';
import { LoginComponent } from './Auth/Views/login/login.component';
import { RegisterComponent } from './Auth/Views/register/register.component';
import { HomeComponent } from './Core/Views/home/home.component';
import { AuthGuard } from './Guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/Home', pathMatch: 'full' },
  { path: 'Home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'Register', component: RegisterComponent },
  { path: 'Login',component: LoginComponent }
];

export const AppRoutingModule = RouterModule.forRoot(routes, { useHash: true });