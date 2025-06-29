import {Component, OnInit} from '@angular/core';
import {PrestSercice} from '../../services/prestamo/prest-sercice';
import {Loan} from '../../model/loan';
import {FormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {ModalPrestamo} from '../modal-prestamo/modal-prestamo';

@Component({
  selector: 'app-comp-prestamo',
  imports: [
    FormsModule,
    DatePipe,
    ModalPrestamo
  ],
  templateUrl: './comp-prestamo.html',
  styleUrl: './comp-prestamo.scss'
})
export class CompPrestamo implements OnInit {
  prestamos: Loan[] = [];
  error: string | null = null;
  stateFilter:string = '';
  showModal:boolean = false;
  constructor(private servicePrestamo:PrestSercice) {}

  ngOnInit(){
    this.getAllPrestamos();
  }

  getAllPrestamos(){
    this.error=null;
    this.servicePrestamo.getAllPrestamos().subscribe({
        next: (data) => {
          this.prestamos = data;
          console.log(data);
        }, error: (error) => {
          this.error = "No se pudieron cargar los prestamos";
          console.log("Ha ocurrido un error al cargar los prestamos:", error);
      }
      }
    );
  }

  filterState(){
    if (!this.stateFilter){
      this.getAllPrestamos();
      return;
    }
    this.servicePrestamo.getAllState(this.stateFilter).subscribe({
      next: (data) => {
        this.prestamos = data;
      },error: (error) => {
        console.log("Ocurrio un error al filtrar por ",this.stateFilter,error);
        this.error = "No se pudieron cargar los prestamos filtados";
      }
    });
  }

  addPrestamo(){
    this.showModal = true;
  }

  closeModal(){
    this.showModal = false;
  }
}
