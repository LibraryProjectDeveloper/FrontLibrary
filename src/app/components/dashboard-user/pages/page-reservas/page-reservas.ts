import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth-service';

import {
  Reserve,
  ReserveService,
} from '../../../../services/reserve/reserve-service';

@Component({
  selector: 'app-page-reservas',
  imports: [],
  templateUrl: './page-reservas.html',
  styleUrl: './page-reservas.css',
})
export class PageReservas implements OnInit {
  authService = inject(AuthService);
  reservaService = inject(ReserveService);
  userId: number | null = 0;
  reservas: Reserve[] = [];
  errorMessage: string | null = null;
  loading: boolean = true;

  constructor() {
    this.userId = this.authService.getUserId();
  }
  ngOnInit(): void {
    this.getReservas();
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
}
