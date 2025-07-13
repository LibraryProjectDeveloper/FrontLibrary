import { Component, OnInit } from '@angular/core';
import { PrestSercice } from '../../services/prestamo/prest-sercice';
import { Loan } from '../../model/loan';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
import { ModalPrestamo } from '../modal-prestamo/modal-prestamo';
import { LoanRequest } from '../../model/LoanRequest';
import { LoanUpdateResponse } from '../../model/LoanUpdateRequest';

@Component({
  selector: 'app-comp-prestamo',
  imports: [FormsModule, DatePipe, ModalPrestamo, NgClass],
  templateUrl: './comp-prestamo.html',
  styleUrl: './comp-prestamo.scss',
})
export class CompPrestamo implements OnInit {
  prestamos: Loan[] = [];
  error: string | null = null;
  stateFilter: string = '';
  showModal: boolean = false;
  dni: string = '';
  editar: boolean = false;
  prestaUpdate: LoanUpdateResponse | null = null;

  idPrestamoedit: number = 0;
  constructor(private servicePrestamo: PrestSercice) {}

  ngOnInit() {
    this.getAllPrestamos();
  }

  getAllPrestamos() {
    this.error = null;
    this.servicePrestamo.getAllPrestamos().subscribe({
      next: (data) => {
        this.prestamos = data;
        console.log('Prestamos', data);
      },
      error: (error) => {
        this.error = 'No se pudieron cargar los prestamos';
        console.log('Ha ocurrido un error al cargar los prestamos:', error);
      },
    });
  }

  filterState() {
    if (!this.stateFilter) {
      this.getAllPrestamos();
      return;
    }
    this.servicePrestamo.getAllState(this.stateFilter).subscribe({
      next: (data) => {
        this.prestamos = data;
      },
      error: (error) => {
        console.log(
          'Ocurrio un error al filtrar por ',
          this.stateFilter,
          error
        );
        this.error = 'No se pudieron cargar los prestamos filtados';
      },
    });
  }

  addPrestamo() {
    this.editar = false;
    this.prestaUpdate = null;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  getAllByUser() {
    this.error = null;
    if (!this.dni) {
      this.getAllPrestamos();
      return;
    }
    //this.prestamos = [];
    this.servicePrestamo.getAllByUserId(this.dni).subscribe({
      next: (data) => {
        if (data.length > 0) {
          console.log(data);
          this.prestamos = data;
        } else {
          alert('No se encontraron los prestamos para el dni ingresado');
          return;
        }
      },
      error: (error) => {
        this.error = 'No se pudieron cargar los prestamos';
        console.log('Ha ocurrido un error', error);
      },
    });
  }

  save(Loan: LoanRequest) {
    if (this.editar && this.prestaUpdate && this.idPrestamoedit) {
      const id = this.prestaUpdate.userId;
      this.servicePrestamo.updateLoan(Loan, id).subscribe({
        next: (data) => {
          console.log('Se actualizo el prestamo', data);
          this.getAllPrestamos();
          this.closeModal();
        },
        error: (error) => {
          console.log('Ha ocurrido un error al actualizar el prestamo', error);
        },
      });
    } else {
      this.servicePrestamo.addLoan(Loan).subscribe({
        next: (data) => {
          console.log('Se guardo el prestamo', data);
          this.getAllPrestamos();
          this.closeModal();
        },
        error: (error) => {
          console.log('Ha ocurrido un error al guardar el prestamo', error);
        },
      });
    }
    console.log('Se guardo', Loan);
  }

  edit(prest: Loan) {
    this.editar = true;
    this.showModal = true;
    this.prestaUpdate = {
      booksQuantity: prest.booksQuantity,
      userId: prest.userId,
      librarianId: prest.librarian,
      books: prest.bookResponseList,
      loanDays: this.calculateLoanDays(prest.loanDate, prest.devolutionDate),
      state: prest.state,
    };
    this.idPrestamoedit = prest.idLean;
    console.log(this.prestaUpdate);
  }

  calculateLoanDays(londDate: string, returnDate: string): number {
    const startDate = new Date(londDate);
    const endDate = new Date(returnDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}
