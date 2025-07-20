import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth-service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Reserve,
  ReserveService,
} from '../../../../services/reserve/reserve-service';
import { CommonModule } from '@angular/common';
import { ModalDetalleReserve } from '../modal-detalle-reserve/modal-detalle-reserve';
@Component({
  selector: 'app-page-reservas',
  imports: [ReactiveFormsModule, CommonModule, ModalDetalleReserve],
  templateUrl: './page-reservas.html',
  styleUrl: './page-reservas.css',
})
export class PageReservas implements OnInit {
  authService = inject(AuthService);
  reservaService = inject(ReserveService);
  formFilter!: FormGroup;
  fb = inject(FormBuilder);
  userId: number | null = 0;
  reservas: Reserve[] = [];
  errorMessage: string | null = null;
  loading: boolean = true;

  // Variables para manejar el modal
  showModal: boolean = false;
  selectedReserve: Reserve | null = null;

  constructor() {
    this.userId = this.authService.getUserId();
  }
  ngOnInit(): void {
    this.getReservas();
    this.initForm();
  }

  initForm() {
    this.formFilter = this.fb.group({
      searchBookAut: ['', [Validators.pattern('^[a-zA-Z ]*$')]],
      searchDate: [''],
      state: ['info'],
    });
  }

  getReservas() {
    this.loading = true;
    this.errorMessage = null;
    if (this.userId) {
      this.reservaService.getRereserveByUserId(this.userId).subscribe({
        next: (response: Reserve[]) => {
          this.reservas = response;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Reservas no encontradas';
          console.error('Error al cargar las reservas:', error);
        },
      });
    }
  }

  searchReservaByTitleAuthor(title: string) {
    if (!title || title.trim() === '') {
      // this.getReservas();
      return;
    }
    this.loading = true;
    this.errorMessage = null;
    if (!this.userId) {
      this.loading = false;
      return;
    } else {
      this.reservaService
        .getSearchReserveBokkAuthor(title, this.userId)
        .subscribe({
          next: (response: Reserve[]) => {
            if (!response || response.length === 0) {
              this.loading = false;
              this.errorMessage =
                'No se encontraron reservas con ese título o autor';
              return;
            } else {
              console.log('Reservas encontradas:', response);
              this.reservas = response;
              this.loading = false;
            }
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = 'Error al buscar reservas por título o autor';
            console.error('Error al buscar reservas:', error);
          },
        });
    }
  }

  searchReservaByDate(date: string) {
    if (!date || date.trim() === '') {
      // this.getReservas();
      return;
    }
    this.loading = true;
    this.errorMessage = null;
    if (!this.userId) {
      this.loading = false;
      return;
    } else {
      this.reservaService.searchReserveByUserCode(date, this.userId).subscribe({
        next: (response: Reserve[]) => {
          if (!response || response.length === 0) {
            this.loading = false;
            this.errorMessage =
              'No se encontraron reservas para la fecha proporcionada';
            return;
          } else {
            console.log('Reservas encontradas:', response);
            this.reservas = response;
            this.loading = false;
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Error al buscar reservas por fecha';
          console.error('Error al buscar reservas:', error);
        },
      });
    }
  }

  searchReservaByState(state: boolean) {
    this.loading = true;
    this.errorMessage = null;
    if (!this.userId) {
      this.loading = false;
      return;
    } else {
      this.reservaService
        .searchReserveStateByUserId(state, this.userId)
        .subscribe({
          next: (response: Reserve[]) => {
            if (!response || response.length === 0) {
              this.loading = false;
              this.errorMessage =
                'No se encontraron reservas con el estado proporcionado';
              return;
            } else {
              console.log('Reservas encontradas:', response);
              this.reservas = response;
              this.loading = false;
            }
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = 'No se encontraron reservas';
            console.error('Error al buscar reservas:', error);
          },
        });
    }
  }

  recargarReservas() {
    this.resetearFiltros();
    this.errorMessage = null;
    this.getReservas();
  }

  resetearFiltros() {
    this.formFilter.patchValue({
      searchBookAut: '',
      searchDate: '',
      state: 'info',
    });
  }

  // Métodos para manejar el modal
  openModal(reserve: Reserve): void {
    this.selectedReserve = reserve;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedReserve = null;
  }
}
