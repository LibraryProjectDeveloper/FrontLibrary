import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './components/login/login';
import {Dashboard} from './components/dashboard/dashboard';
import {Usuario} from './components/usuario/usuario';
import {BookComponent} from './components/book/book';
export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'panel', component: Dashboard, children:[
      {path: 'users', component: Usuario},
      {path:'books',component:BookComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
