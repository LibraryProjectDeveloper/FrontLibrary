import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {User, UserService} from '../../services/user/user-service';

@Component({
  selector: 'app-usuario',
  imports: [CommonModule],
  templateUrl: './usuario.html',
  standalone: true,
  styleUrl: './usuario.scss'
})
export class Usuario {
  loading: boolean = true;
  error:string|null = null;
  users: User[] = [];
  constructor(private userService:UserService) {}
  ngOnInit():void{
    this.getUsers();
  }
  getUsers(){
    this.loading = true;
    this.error = null;
    this.userService.getUsers().subscribe({
      next: (response:User[])=>{
        this.users = response;
        this.loading = false;
      },
      error: ()=>{
        this.loading = false;
        this.error = 'Error al cargar los usuarios';
        console.log('Error al cargar los usuarios');
      }
    })
  }

}
