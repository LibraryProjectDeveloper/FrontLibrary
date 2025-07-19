import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth-service';
import { PrestSercice } from '../../../../services/prestamo/prest-sercice';
import { Loan } from '../../../../model/loan';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-page-prestamos',
  imports: [DatePipe, FormsModule],
  templateUrl: './page-prestamos.html',
  styleUrl: './page-prestamos.css',
})
export class PagePrestamos implements OnInit {
  authSErvice = inject(AuthService);
  loanService = inject(PrestSercice);
  prestamosService = inject(PrestSercice);
  userId: number | null = 0;
  prestamos: Loan[] = [];
  errorMessage: string | null = null;
  loading: boolean = true;
  queryValid: boolean = true;

  filter = {
    query: '',
    state: '',
  };
  constructor() {
    this.userId = this.authSErvice.getUserId();
  }

  ngOnInit(): void {
    this.getPrestamos();
  }
  recardarPrestamos() {
    this.getPrestamos();
  }
  getPrestamos() {
    if (this.userId) {
      this.loading = true;
      this.errorMessage = null;
      this.prestamosService.getByUserId(this.userId).subscribe({
        next: (response: Loan[]) => {
          this.prestamos = response;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Prestamos no encontrados';
          console.error('Error al cargar los prestamos:', error);
        },
      });
    }
  }

  search() {
    if (!this.filter.query || this.filter.query.trim() === '') {
      //this.getPrestamos();
      return;
    }
    console.log('Valor de query:', this.filter.query);
    console.log('User ID:', this.userId);

    this.loading = true;
    this.errorMessage = null;

    if (typeof this.userId === 'number' && this.userId !== null) {
      this.prestamosService
        .serchLoanBookAuthorUser(this.filter.query, this.userId)
        .subscribe({
          next: (response: Loan[]) => {
            this.prestamos = response;
            this.loading = false;
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = 'Error al buscar prestamos';
            console.error('Error al buscar prestamos:', error);
          },
        });
    } else {
      this.loading = false;
      this.errorMessage = 'ID de usuario inválido';
    }
  }

  searchByState() {
    if (!this.filter.state || this.filter.state.trim() === '') {
      //this.getPrestamos();
      return;
    }
    console.log('Valor de estado:', this.filter.state);
    console.log('User ID:', this.userId);

    this.loading = true;
    this.errorMessage = null;

    if (typeof this.userId === 'number' && this.userId !== null) {
      this.prestamosService
        .searchLoanSatateByUser(this.filter.state, this.userId)
        .subscribe({
          next: (response: Loan[]) => {
            this.prestamos = response;
            this.loading = false;
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = 'Error al buscar prestamos por estado';
            console.error('Error al buscar prestamos por estado:', error);
          },
        });
    } else {
      this.loading = false;
      this.errorMessage = 'ID de usuario inválido';
    }
  }

  validateQuery(): void {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regex.test(this.filter.query)) {
      this.queryValid = false;
    } else {
      this.queryValid = true;
    }
  }
}
