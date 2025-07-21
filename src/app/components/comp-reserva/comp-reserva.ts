import { Component, OnInit } from '@angular/core';
import {
  Reserve,
  ReserveRequest,
  ReserveService,
} from '../../services/reserve/reserve-service';
import { ModalReserva } from '../modal-reserva/modal-reserva';
import { NgClass } from '@angular/common';
import { ModalReport } from '../modal-report/modal-report';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, skip } from 'rxjs';
import { PageResponse } from '../../model/PageResponse';
@Component({
  selector: 'app-comp-reserva',
  imports: [NgClass, ModalReserva, ReactiveFormsModule, ModalReport],
  templateUrl: './comp-reserva.html',
  styleUrl: './comp-reserva.scss',
})
export class CompReserva implements OnInit {
  loading: boolean = true;
  error: string | null = null;
  reserves: Reserve[] = [];
  showModal = false;
  isVisible: boolean = false;
  edit: boolean = false;
  reserveEdit: Reserve | null = null;
  formFilter!: FormGroup;

  page: number = 0;
  size: number = 5;
  totalElements: number = 0;
  totalPages: number = 0;
  pagesArray: number[] = [];
  currentPage: number = 0;
  constructor(private reserveService: ReserveService, fb: FormBuilder) {
    this.getReserves(0, this.size);
    this.formFilter = fb.group({
      searchDni: ['', [Validators.maxLength(8)]],
      searchTitle: [''],
      searchDate: [''],
      state: ['true'],
    });
  }
  ngOnInit(): void {
    this.formFilter
      .get('searchDni')
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        console.log('Valor de searchDni:', value);
        this.getReserveByDni(value);
      });

    this.formFilter
      .get('searchTitle')
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        console.log('Valor de searchTitle:', value);
        this.getReserveByTitle(value);
      });
    this.formFilter
      .get('searchDate')
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        console.log('Valor de searchDate:', value);
        this.getReserveByDate(value);
      });
    this.formFilter
      .get('state')
      ?.valueChanges.pipe(
        skip(1),
        debounceTime(1000),
        distinctUntilChanged(),
        filter((value) => value !== null && value !== undefined)
      )
      .subscribe((value) => {
        if (value === 'true') {
          this.getReserveActives();
        }
        if (value === 'false') {
          this.getReserveInactives();
        }
      });
  }

  deshabilitarCampos(campo: string) {
    Object.keys(this.formFilter.controls).forEach((key) => {
      if (key !== campo) {
        this.formFilter.get(key)?.disable();
      }
    });
  }

  habilitarCampos(campo: string) {
    const valor = this.formFilter.get(campo)?.value;
    if (!valor || valor.trim() === '') {
      Object.keys(this.formFilter.controls).forEach((key) => {
        this.formFilter.get(key)?.enable();
      });
    }
  }

  getReserves(page: number = 0, size: number = 5): void {
    this.loading = true;
    this.error = null;

    this.page = page;
    this.reserveService.getReserves(page, size).subscribe({
      next: (response: PageResponse<Reserve>) => {
        console.log(response);
        this.reserves = response.content;
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
        this.error = 'Error al cargar las reservas';
        console.log('Error al cargar las reservas');
      },
    });
  }

  generateReport() {
    this.showModal = true;
  }
  closeModalReport() {
    this.showModal = false;
  }
  getReserveActives() {
    this.loading = true;
    this.error = null;
    this.reserveService.getReserveActives().subscribe({
      next: (response) => {
        console.log('respuesta ', response);
        if (response.length === 0) {
          this.loading = false;
          this.error = 'No hay reservas activas';
        } else {
          this.reserves = response;
          // Resetear variables de paginación para filtros sin paginación
          this.totalElements = response.length;
          this.totalPages = 1;
          this.currentPage = 0;
          this.page = 0;
          this.pagesArray = [1];
          this.loading = false;
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar las reservas activas';
        console.log('Error al cargar las reservas activas');
      },
    });
  }
  getReserveInactives() {
    this.loading = true;
    this.error = null;
    this.reserveService.getReserveInactives().subscribe({
      next: (response) => {
        console.log('respuesta ', response);
        if (response.length === 0) {
          this.loading = false;
          this.error = 'No hay reservas inactivas';
        } else {
          this.reserves = response;
          // Resetear variables de paginación para filtros sin paginación
          this.totalElements = response.length;
          this.totalPages = 1;
          this.currentPage = 0;
          this.page = 0;
          this.pagesArray = [1];
          this.loading = false;
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar las reservas inactivas';
        console.log('Error al cargar las reservas inactivas');
      },
    });
  }
  getReserveByDni(dni: string) {
    this.loading = true;
    this.error = null;
    if (!dni || dni.trim() === '') {
      this.loading = false;
      this.error = null;
      return;
    }
    this.reserveService.getReserveByDnI(dni).subscribe({
      next: (response) => {
        console.log('respuesta ', response);
        if (response.length === 0) {
          this.loading = false;
          this.error = 'No se encontraron reservas para el DNI proporcionado';
        } else {
          this.reserves = response;
          // Resetear variables de paginación para filtros sin paginación
          this.totalElements = response.length;
          this.totalPages = 1;
          this.currentPage = 0;
          this.page = 0;
          this.pagesArray = [1];
          this.loading = false;
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar las reservas por DNI';
        console.log('Error al cargar las reservas por DNI');
      },
    });
  }
  getReserveByTitle(title: string) {
    this.loading = true;
    this.error = null;
    if (!title || title.trim() === '') {
      this.loading = false;
      this.error = null;
      return;
    }
    this.reserveService.getRereserveByTitle(title).subscribe({
      next: (response) => {
        console.log('respuesta ', response);
        if (response.length === 0) {
          this.loading = false;
          this.error =
            'No se encontraron reservas para el título proporcionado';
        } else {
          this.reserves = response;
          // Resetear variables de paginación para filtros sin paginación
          this.totalElements = response.length;
          this.totalPages = 1;
          this.currentPage = 0;
          this.page = 0;
          this.pagesArray = [1];
          this.loading = false;
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar las reservas por título';
        console.log('Error al cargar las reservas por título');
      },
    });
  }

  getReserveByDate(date: string) {
    this.loading = true;
    this.error = null;
    if (!date || date.trim() === '') {
      this.loading = false;
      this.error = null;
      return;
    }
    this.reserveService.getReserveByDate(date).subscribe({
      next: (response) => {
        console.log('respuesta ', response);
        if (response.length === 0) {
          this.loading = false;
          this.error = 'No se encontraron reservas para la fecha proporcionada';
        } else {
          this.reserves = response;
          // Resetear variables de paginación para filtros sin paginación
          this.totalElements = response.length;
          this.totalPages = 1;
          this.currentPage = 0;
          this.page = 0;
          this.pagesArray = [1];
          this.loading = false;
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar las reservas por fecha';
        console.log('Error al cargar las reservas por fecha');
      },
    });
  }

  openModal() {
    this.isVisible = true;
    this.reserveEdit = null;
    this.edit = false;
  }

  closeModal() {
    this.isVisible = false;
  }

  editar(reser: Reserve) {
    this.isVisible = true;
    this.reserveEdit = reser;
    this.edit = true;
  }

  saveReserve($event: ReserveRequest) {
    if (!this.edit && this.reserveEdit === null) {
      console.log('Guardando nueva reserva:', $event);
      this.guardarReserva($event);
    } else {
      console.log('Actualizando reserva:', $event);
      this.actualizarReserva($event);
    }
  }

  guardarReserva(reserve: ReserveRequest) {
    this.reserveService.addReserve(reserve).subscribe({
      next: (response) => {
        this.getReserves(0, this.size);
        this.isVisible = false;
        console.log('Reserva guardada:', response);
      },
      error: (error) => {
        console.error('Error al guardar la reserva:', error);
      },
    });
  }

  actualizarReserva(reserve: ReserveRequest) {
    this.reserveService.updateReserve(reserve).subscribe({
      next: (response) => {
        this.getReserves(0, this.size);
        this.isVisible = false;
        console.log('Reserva actualizada:', response);
      },
      error: (error) => {
        console.error('Error al actualizar la reserva:', error);
      },
    });
  }

  deleteReserve(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      this.reserveService.deleteReserve(id).subscribe({
        next: () => {
          this.getReserves(0, this.size);
          console.log('Reserva eliminada con éxito');
        },
        error: (error) => {
          console.error('Error al eliminar la reserva:', error);
        },
      });
    }
  }

  cargarReservas() {
    this.formFilter.reset();
    this.getReserves(0, this.size);
  }

  goPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.page = page;
    this.getReserves(this.page, this.size);
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
