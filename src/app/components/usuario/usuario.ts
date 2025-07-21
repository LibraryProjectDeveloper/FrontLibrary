import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { User, UserService } from '../../services/user/user-service';
import { FormsModule } from '@angular/forms';
import { ComModalUser } from '../com-modal-user/com-modal-user';
import { UserRequest } from '../../model/UserRequest';
import { DelemodalUser } from '../delemodal-user/delemodal-user';
import { DetaModalUser } from '../deta-modal-user/deta-modal-user';
import { AuthService } from '../../services/auth/auth-service';
import { PageResponse } from '../../model/PageResponse';

@Component({
  selector: 'app-usuario',
  imports: [
    CommonModule,
    FormsModule,
    ComModalUser,
    DelemodalUser,
    DetaModalUser,
    DatePipe,
  ],
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

  // Variables para el modal de detalles
  showDetailModal: boolean = false;
  selectedUserDetail: User | null = null;

  userRoles: string[] = [];
  authService = inject(AuthService);

  //variables para la paginacion
  page: number = 0;
  size: number = 5;
  totalElements: number = 0;
  totalPages: number = 0;
  pagesArray: number[] = [];
  currentPage: number = 0;
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.getUsers();
  }

  // Método para resetear filtros
  resetFilters() {
    this.query = '';
    this.idRol = 0;
    this.state = '';
    this.page = 0;
  }

  // Método para resetear variables de paginación
  resetPaginationVariables() {
    this.page = 0;
    this.totalElements = 0;
    this.totalPages = 0;
    this.currentPage = 0;
    this.pagesArray = [];
  }

  // Métodos wrapper para llamadas desde el HTML (sin parámetros)
  onSearchUser() {
    this.resetPaginationVariables();
    this.searchUser(0, this.size);
  }

  onGetRol() {
    this.resetPaginationVariables();
    this.getRol(0, this.size);
  }

  onGetUsersState() {
    this.resetPaginationVariables();
    this.getUsersState();
  }
  getUsers(page: number = 0, size: number = 5) {
    this.loading = true;
    this.error = null;
    this.page = page; // Actualizar la página actual
    this.userService.getUsersActives(page, size).subscribe({
      next: (response: PageResponse<User>) => {
        this.user = null;
        this.users = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.page;
        this.pagesArray = Array.from(
          { length: this.totalPages },
          (_, i) => i + 1
        );
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar los usuarios';
        console.log('Error al cargar los usuarios');
      },
    });
  }

  verificarRol(role: string) {
    const isValide = this.authService.hasRole(role);
    return isValide;
  }

  searchUser(page: number = 0, size: number = 5) {
    if (!this.query.trim()) {
      // Limpiar otros filtros y cargar usuarios normales
      this.idRol = 0;
      this.state = '';
      this.resetPaginationVariables();
      this.getUsers(0, size);
      return;
    }
    if (!this.validateQuery(this.query)) {
      alert('Consulta inválida. Por favor, ingrese un término válido.');
      this.query = '';
      this.resetPaginationVariables();
      this.getUsers(0, size);
      return;
    }

    // Limpiar otros filtros cuando se busca por query
    this.idRol = 0;
    this.state = '';

    this.loading = true;
    this.error = null;
    this.page = page;
    this.userService.searchUser(this.query, page, size).subscribe({
      next: (response: PageResponse<User>) => {
        this.users = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.page;
        this.pagesArray = Array.from(
          { length: this.totalPages },
          (_, i) => i + 1
        );
        console.log('Usuarios encontrados:', response);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al buscar usuarios';
        console.log('Error al buscar usuarios');
      },
    });
  }

  validateQuery(query: string) {
    const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ@._\s-]+$/;
    return regex.test(query);
  }

  getRol(page: number = 0, size: number = 5) {
    if (this.idRol == 0) {
      // Limpiar otros filtros y cargar usuarios normales
      this.query = '';
      this.state = '';
      this.resetPaginationVariables();
      this.getUsers(0, size);
      return;
    }

    // Limpiar otros filtros cuando se busca por rol
    this.query = '';
    this.state = '';

    this.loading = true;
    this.error = null;
    this.page = page;
    this.userService.searchUserByRol(this.idRol, page, size).subscribe({
      next: (response: PageResponse<User>) => {
        console.log('Respuesta de búsqueda por rol:', response);
        this.users = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.page;
        this.pagesArray = Array.from(
          { length: this.totalPages },
          (_, i) => i + 1
        );
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
      // Limpiar otros filtros y cargar todos los usuarios
      this.query = '';
      this.idRol = 0;
      this.getUserAll();
      return;
    }

    // Limpiar otros filtros cuando se filtra por estado
    this.query = '';
    this.idRol = 0;
    this.resetPaginationVariables();

    if (this.state === 'true') {
      this.getUsers(0, this.size);
    } else if (this.state === 'false') {
      this.getUserInactives(0, this.size);
    }
  }

  getUserAll() {
    // Limpiar otros filtros
    this.query = '';
    this.idRol = 0;

    this.loading = true;
    this.error = null;
    this.userService.getUsersAll().subscribe({
      next: (response: User[]) => {
        this.users = response;
        // Resetear variables de paginación ya que no está paginado
        this.totalElements = response.length;
        this.totalPages = 1;
        this.currentPage = 0;
        this.page = 0;
        this.pagesArray = [1];
        this.loading = false;
        console.log('Todos los usuarios cargados:', response.length);
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar todos los usuarios';
        console.log('Error al cargar todos los usuarios');
      },
    });
  }

  getUserInactives(page: number = 0, size: number = 5) {
    this.loading = true;
    this.error = null;
    this.page = page; // Actualizar la página actual
    this.userService.getUsersInactives(page, size).subscribe({
      next: (response: PageResponse<User>) => {
        this.users = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.page;
        this.pagesArray = Array.from(
          { length: this.totalPages },
          (_, i) => i + 1
        );
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar los usuarios inactivos';
        console.log('Error al cargar los usuarios inactivos');
      },
    });
  }
  /*
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
*/
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

  // Métodos para manejar el modal de detalles
  openDetailModal(user: User): void {
    this.selectedUserDetail = user;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedUserDetail = null;
  }

  goPage(page: number) {
    if (page < 0 || page >= this.totalPages) {
      console.error('Número de página inválido:', page);
      return;
    }

    // Determinar qué método usar según los filtros activos - orden de prioridad
    if (this.query && this.query.trim() !== '') {
      this.searchUser(page, this.size);
    } else if (this.idRol && this.idRol !== 0) {
      this.getRol(page, this.size);
    } else if (this.state && this.state !== '') {
      if (this.state === 'true') {
        this.getUsers(page, this.size);
      } else if (this.state === 'false') {
        this.getUserInactives(page, this.size);
      }
    } else {
      console.log('Navegando sin filtros');
      this.getUsers(page, this.size);
    }
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5; // Número máximo de páginas visibles

    // Si hay pocas páginas, mostrar todas
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i < this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Lógica para mostrar páginas alrededor de la página actual
    let startPage = Math.max(1, this.currentPage - 1);
    let endPage = Math.min(this.totalPages - 1, this.currentPage + 1);

    // Ajustar si estamos muy cerca del inicio
    if (this.currentPage <= 2) {
      endPage = Math.min(this.totalPages - 1, 3);
    }

    // Ajustar si estamos muy cerca del final
    if (this.currentPage >= this.totalPages - 2) {
      startPage = Math.max(1, this.totalPages - 3);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}
