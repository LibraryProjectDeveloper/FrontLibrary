import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Usuario } from './components/usuario/usuario';
import { BookComponent } from './components/book/book';
import { authGuard } from './guards/auth-guard';
import { Unauthorized } from './components/unauthorized/unauthorized';
import { Home } from './components/home/home';
import { CompReserva } from './components/comp-reserva/comp-reserva';
import { CompPrestamo } from './components/comp-prestamo/comp-prestamo';
import { DashboardUser } from './components/dashboard-user/dashboard-user';
import { PageReservas } from './components/dashboard-user/pages/page-reservas/page-reservas';
import { PagePrestamos } from './components/dashboard-user/pages/page-prestamos/page-prestamos';
import { PageCatalago } from './components/dashboard-user/pages/page-catalago/page-catalago';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'panel',
    component: Dashboard,
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_LIBRARIAN'] },
    children: [
      {
        path: 'users',
        component: Usuario,
        canActivate: [authGuard],
        data: { roles: ['ROLE_ADMIN', 'ROLE_LIBRARIAN'] },
      },
      {
        path: 'books',
        component: BookComponent,
        canActivate: [authGuard],
        data: { roles: ['ROLE_ADMIN', 'ROLE_LIBRARIAN'] },
      },
      { path: 'home', component: Home },
      {
        path: 'reserva',
        component: CompReserva,
        canActivate: [authGuard],
        data: { roles: ['ROLE_ADMIN', 'ROLE_LIBRARIAN'] },
      },
      {
        path: 'prestamo',
        component: CompPrestamo,
        canActivate: [authGuard],
        data: { roles: ['ROLE_ADMIN', 'ROLE_LIBRARIAN'] },
      },
    ],
  },
  { path: 'unauthorized', component: Unauthorized },
  {
    path: 'panelUser',
    component: DashboardUser,
    canActivate: [authGuard],
    data: { roles: ['ROLE_USER'] },
    children: [
      { path: 'reservas', component: PageReservas },
      { path: 'prestamos', component: PagePrestamos },
      { path: 'catalogo', component: PageCatalago },
    ],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
