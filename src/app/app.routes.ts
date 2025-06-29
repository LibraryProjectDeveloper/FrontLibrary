import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './components/login/login';
import {Dashboard} from './components/dashboard/dashboard';
import {Usuario} from './components/usuario/usuario';
import {BookComponent} from './components/book/book';
import {authGuard} from './guards/auth-guard';
import {Unauthorized} from './components/unauthorized/unauthorized';
import {Home} from './components/home/home';
import {CompReserva} from './components/comp-reserva/comp-reserva';
import {CompPrestamo} from './components/comp-prestamo/comp-prestamo';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'panel', component: Dashboard, children:[
      {path: 'users', component: Usuario, canActivate:[authGuard],data:{roles: ['ROLE_ADMIN','ROLE_LIBRARIAN']}},
      {path:'books',component:BookComponent,canActivate:[authGuard],data:{roles: ['ROLE_ADMIN','ROLE_LIBRARIAN']}},
      {path: 'home',component:Home,canActivate:[authGuard],data:{roles: ['ROLE_ADMIN','ROLE_LIBRARIAN']}},
      {path: 'reserva', component: CompReserva,canActivate:[authGuard],data:{roles: ['ROLE_ADMIN','ROLE_LIBRARIAN']}},
      {path: 'prestamo', component: CompPrestamo},
    ]},
  { path: '**', redirectTo: 'login' },
  {path: 'unauthorized',component: Unauthorized}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
