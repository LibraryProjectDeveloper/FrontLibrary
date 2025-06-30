import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {User, UserService} from '../../services/user/user-service';
import {ModalUsuario} from '../modal-usuario/modal-usuario';

@Component({
  selector: 'app-usuario',
  imports: [CommonModule, ModalUsuario],
  templateUrl: './usuario.html',
  standalone: true,
  styleUrl: './usuario.scss'
})
export class Usuario implements OnInit {
  users: User[] = [];
  loading: boolean = true;
  error:string|null = null;
  showModal = false;
  editMode = false;
  selectedUser: User | null = null;
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


  openAddModal(): void {
    this.editMode = false;
    this.selectedUser = null;
    this.showModal = true;
  }

  openEditModal(user: User): void {
    this.editMode = true;
    this.selectedUser = user;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveUser($event: "saveUser($event)") {

  }
}
