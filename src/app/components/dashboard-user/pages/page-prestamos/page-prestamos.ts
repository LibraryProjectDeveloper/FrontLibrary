import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth-service';
import { PrestSercice } from '../../../../services/prestamo/prest-sercice';
import { Loan } from '../../../../model/loan';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-page-prestamos',
  imports: [DatePipe],
  templateUrl: './page-prestamos.html',
  styleUrl: './page-prestamos.css',
})
export class PagePrestamos implements OnInit {
  authSErvice = inject(AuthService);
  prestamosService = inject(PrestSercice);
  userId: number | null = 0;
  prestamos: Loan[] = [];
  errorMessage: string | null = null;
  loading: boolean = true;

  constructor() {
    this.userId = this.authSErvice.getUserId();
  }

  ngOnInit(): void {
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
}
