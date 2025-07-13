import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UserService } from '../../services/user/user-service';
import { FormsModule } from '@angular/forms';
import { ComModalUser } from '../com-modal-user/com-modal-user';
import { UserRequest } from '../../model/UserRequest';
import { DelemodalUser } from '../delemodal-user/delemodal-user';
import { AuthService } from '../../services/auth/auth-service';
@Component({
  selector: 'app-usuario',
  imports: [CommonModule, FormsModule, ComModalUser, DelemodalUser],
  templateUrl: './usuario.html',
  standalone: true,
  styleUrl: './usuario.scss',
})
export class Usuario {
  loading: boolean = true;
  error: string | null = null;
  users: User[] = [];
  user: User | null = null;
  userUpdated: User | null = null;
  query: string = '';
  idRol: number = 0;
  state: string = '';
  showModal: boolean = false;
  editar: boolean = false;
  userSave: UserRequest | null = null;
  showDeleteModal: boolean = false;
  idUserDelete: number = 0;

  userRoles: string[] = [];
  authService = inject(AuthService);
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.getUsers();
  }
  getUsers() {
    this.loading = true;
    this.error = null;
    this.userService.getUsersActives().subscribe({
      next: (response: User[]) => {
        this.user = null;
        this.users = response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar los usuarios';
        console.log('Error al cargar los usuarios');
      },
    });
  }

  searchUser() {
    if (!this.query.trim()) {
      this.getUsers();
      return;
    }
    this.loading = true;
    this.error = null;
    this.userService.searchUser(this.query).subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.user = null;
          this.users = response;
          console.log('Usuarios encontrados:', this.users);
        } else {
          console.log('Usuario encontrado:', response);
          this.users = [];
          this.user = response;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al buscar usuarios';
        console.log('Error al buscar usuarios');
      },
    });
  }

  getRol() {
    if (this.idRol == 0) {
      this.getUsers();
      return;
    }

    this.loading = true;
    this.error = null;
    this.userService.searchUserByRol(this.idRol).subscribe({
      next: (response: User[]) => {
        this.users = response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al buscar usuarios por rol';
        console.log('Error al buscar usuarios por rol');
      },
    });
  }

  getUsersState() {
    if (!this.state || this.state === '') {
      this.getUserAll();
      return;
    }

    if (this.state === 'true') {
      this.getUserActives();
    } else if (this.state === 'false') {
      this.getUserInactives();
    }
  }

  getUserAll() {
    this.loading = true;
    this.error = null;
    this.userService.getUsersAll().subscribe({
      next: (response: User[]) => {
        this.users = response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar todos los usuarios';
        console.log('Error al cargar todos los usuarios');
      },
    });
  }

  getUserInactives() {
    this.loading = true;
    this.error = null;
    this.userService.getUsersInactives().subscribe({
      next: (response: User[]) => {
        this.users = response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar los usuarios inactivos';
        console.log('Error al cargar los usuarios inactivos');
      },
    });
  }

  getUserActives() {
    this.loading = true;
    this.error = null;
    this.userService.getUsersActives().subscribe({
      next: (response: User[]) => {
        this.users = response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar los usuarios activos';
        console.log('Error al cargar los usuarios activos');
      },
    });
  }

  openModal() {
    this.showModal = true;
    this.editar = false;
    console.log(
      'abriendo modal para agregar usuario, editar:',
      this.editar,
      'showModal',
      this.showModal
    );
  }

  close() {
    this.showModal = false;
  }

  edit(user: User) {
    console.log('Método edit() ejecutado - inicio'); // Debug
    this.showModal = true;
    this.editar = true;
    this.userUpdated = user;
    console.log('Boton Editar Presionado', this.editar);
    console.log('Usuario a editar:', user);
    console.log('showModal después de setear:', this.showModal); // Debug
  }

  saveUser(User: UserRequest) {
    this.userSave = User;
    if (this.editar && this.userUpdated) {
      this.userService.updateUser(this.userSave).subscribe({
        next: () => {
          alert('Usuario actualizado correctamente');
          this.getUsers();
        },
        error: (error) => {
          console.error('Error al actualizar el usuario:', error);
        },
      });
    } else {
      this.userService.addUser(this.userSave).subscribe({
        next: () => {
          alert('Usuario agregado correctamente');
          this.getUsers();
        },
        error: (error) => {
          console.error('Error al agregar el usuario:', error);
        },
      });
    }
  }

  openDeleteModal(idUser: number) {
    this.idUserDelete = idUser;
    this.showDeleteModal = true;
    console.log(
      'Abriendo modal de eliminación para el usuario con id:',
      idUser
    );
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    console.log('Cerrando modal de eliminación');
  }

  deleteUser(idUser: number) {
    this.userService.deleteUser(idUser).subscribe({
      next: () => {
        this.getUsers();
        this.closeDeleteModal();
      },
      error: (error) => {
        console.error('Error al eliminar el usuario:', error);
        alert('Error al eliminar el usuario');
      },
    });
  }

  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }
}
