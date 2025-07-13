import { Component, OnInit } from '@angular/core';
import {Reserve, ReserveRequest, ReserveService,} from '../../services/reserve/reserve-service';
import { ModalReserva } from '../modal-reserva/modal-reserva';
import {NgClass} from '@angular/common';
import {ModalReport} from '../modal-report/modal-report';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { debounceTime } from 'rxjs';
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

  constructor(private reserveService: ReserveService, fb: FormBuilder) {
    this.formFilter = fb.group({
      searchDni: ['', [Validators.maxLength(8)]],
      searchTitle: [''],
      searchDate: [''],
      state: ['true'],
    });
  }
  ngOnInit(): void {
    this.getReserves();

    this.formFilter
      .get('searchDni')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((value) => {
        console.log('Valor de searchDni:', value);
        if (value && value.trim() !== '') {
          this.getReserveByDni(value);
        } else {
          this.getReserves();
        }
      });

    this.formFilter
      .get('searchTitle')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((value) => {
        console.log('Valor de searchTitle:', value);
        if (value && value.trim() !== '') {
          this.getReserveByTitle(value);
        } else {
          this.getReserves();
        }
      });
    this.formFilter
      .get('searchDate')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((value) => {
        console.log('Valor de searchDate:', value);
        if (value && value.trim() !== '') {
          this.getReserveByDate(value);
        } else {
          this.getReserves();
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

  getReserves() {
    this.loading = true;
    this.error = null;
    this.reserveService.getReserves().subscribe({
      next: (response: Reserve[]) => {
        console.log(response);
        this.reserves = response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar las reservas';
        console.log('Error al cargar las reservas');
      },
    });
  }

  generateReport(){
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
    this.reserveService.getReserveByDnI(dni).subscribe({
      next: (response) => {
        console.log('respuesta ', response);
        if (response.length === 0) {
          this.loading = false;
          this.error = 'No se encontraron reservas para el DNI proporcionado';
        } else {
          this.reserves = response;
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
    this.reserveService.getRereserveByTitle(title).subscribe({
      next: (response) => {
        console.log('respuesta ', response);
        if (response.length === 0) {
          this.loading = false;
          this.error =
            'No se encontraron reservas para el título proporcionado';
        } else {
          this.reserves = response;
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
    this.reserveService.getReserveByDate(date).subscribe({
      next: (response) => {
        console.log('respuesta ', response);
        if (response.length === 0) {
          this.loading = false;
          this.error = 'No se encontraron reservas para la fecha proporcionada';
        } else {
          this.reserves = response;
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
        this.getReserves();
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
        this.getReserves();
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
          this.getReserves();
          console.log('Reserva eliminada con éxito');
        },
        error: (error) => {
          console.error('Error al eliminar la reserva:', error);
        },
      });
    }
  }
}
