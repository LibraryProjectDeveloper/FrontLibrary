import {Component, OnInit} from '@angular/core';
import {Reserve,ReserveService} from '../../services/reserve/reserve-service';
import {NgClass} from '@angular/common';
import {ModalReport} from '../modal-report/modal-report';

@Component({
  selector: 'app-comp-reserva',
  imports: [
    NgClass,
    ModalReport
  ],
  templateUrl: './comp-reserva.html',
  styleUrl: './comp-reserva.scss'

})
export class CompReserva implements OnInit {
  loading: boolean = true;
  error:string|null = null;
  reserves: Reserve[] = [];
  showModal = false;
  constructor(private reserveService:ReserveService) {
  }
  ngOnInit():void{
    this.getReserves();
  }
  getReserves(){
    this.loading = true;
    this.error = null;
    this.reserveService.getReserves().subscribe({
      next: (response:Reserve[])=>{
        console.log(response);
        this.reserves = response;
        this.loading = false;
      },
      error: ()=>{
        this.loading = false;
        this.error = 'Error al cargar las reservas';
        console.log('Error al cargar las reservas');
      }
    })
  }
  generateReport(){
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }
}
