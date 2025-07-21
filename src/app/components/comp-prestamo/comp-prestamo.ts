import { Component, OnInit } from '@angular/core';
import { PrestSercice } from '../../services/prestamo/prest-sercice';
import { Loan } from '../../model/loan';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
import { ModalPrestamo } from '../modal-prestamo/modal-prestamo';
import { LoanRequest } from '../../model/LoanRequest';
import { LoanUpdateResponse } from '../../model/LoanUpdateRequest';
import { PageResponse } from '../../model/PageResponse';

@Component({
  selector: 'app-comp-prestamo',
  imports: [FormsModule, DatePipe, ModalPrestamo, NgClass],
  templateUrl: './comp-prestamo.html',
  styleUrl: './comp-prestamo.scss',
})
export class CompPrestamo implements OnInit {
  prestamos: Loan[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  size: number = 5;
  pagesArray: number[] = [];
  startItem: number = 1;
  endItem: number = 0;

  error: string | null = null;
  stateFilter: string = '';
  showModal: boolean = false;
  dni: string = '';
  editar: boolean = false;
  prestaUpdate: LoanUpdateResponse | null = null;

  searchDate: string = '';

  idPrestamoedit: number = 0;
  constructor(private servicePrestamo: PrestSercice) {}

  ngOnInit() {
    this.getAllPrestamos(0, this.size);
  }

  getAllPrestamos(page: number = 0, size: number = 10) {
    this.error = null;
    this.servicePrestamo.getAllLoans(page, size).subscribe({
      next: (data) => {
        this.prestamos = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.currentPage = data.page;
        this.pagesArray = Array.from(
          { length: this.totalPages },
          (_, i) => i + 1
        );
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
    if (!this.validateDni(this.dni)) {
      alert('DNI inválido. Por favor, ingrese un DNI válido.');
      this.dni = '';
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

  validateDni(query: string): boolean {
    const regex = /^[0-9]+$/;
    return regex.test(query);
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

  finishedLoan(loan: number) {
    if (confirm('Esta seguro que desea finalizar el préstamo?')) {
      this.servicePrestamo.finishedLoan(loan).subscribe({
        next: (data) => {
          console.log('Préstamo finalizado con éxito', data);
          this.getAllPrestamos();
        },
        error: (error) => {
          console.error('Error al finalizar el préstamo:', error);
        },
      });
    }
  }

  deletePrestamo(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este préstamo?')) {
      this.servicePrestamo.deleteLoan(id).subscribe({
        next: () => {
          console.log('Préstamo eliminado con éxito');
          this.getAllPrestamos();
        },
        error: (error) => {
          console.error('Error al eliminar el préstamo:', error);
        },
      });
    }
  }

  searchLoanByDate() {
    if (!this.searchDate) {
      //this.getAllPrestamos();
      return;
    }
    this.servicePrestamo.searchLoandByLoanDate(this.searchDate).subscribe({
      next: (data: Loan[]) => {
        this.error = null;

        if (!data || data.length === 0) {
          this.error = 'No se encontraron prestamos para la fecha ingresada';
          return;
        }
        this.prestamos = data;
        console.log('Prestamos encontrados por fecha', data);
      },
      error: (error) => {
        console.log(
          'Ha ocurrido un error al buscar prestamos por fecha',
          error
        );
        this.error = 'No se pudieron cargar los prestamos por fecha';
      },
    });
  }
  goToPage(page: number) {
    if (page < 0 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.getAllPrestamos(page, this.size);
    this.paginateLoans();
  }

  paginateLoans() {
    console.log(this.totalPages);
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.startItem = (this.currentPage - 1) * this.size + 1;
    this.endItem = Math.min(this.currentPage * this.size, this.totalElements);
    const startIndex = (this.currentPage - 1) * this.size;
  }
}
