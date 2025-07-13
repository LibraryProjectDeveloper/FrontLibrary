import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ReserveReport, ReserveResponse, ReserveService} from '../../services/reserve/reserve-service';
import {DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
@Component({
  selector: 'app-modal-report',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './modal-report.html',
  styleUrl: './modal-report.scss'
})
export class ModalReport implements OnInit{
  Reserve:ReserveResponse[] = [];
  loading:boolean = true;
  error:string | null = null;
  dateStart: string = '';
  dateEnd: string = '';
  stateButton = false;
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();


  constructor(private reserveService:ReserveService) {}
  ngOnInit():void {
    this.getData('','');
  }

  getData(dateStart:string,dateEnd:string){
    this.loading = true;
    this.error = null;
    this.reserveService.getReservesReport(dateStart,dateEnd).subscribe({
      next: (response:ReserveResponse[])=>{
        this.Reserve = response;
        this.stateButton = this.Reserve.length === 0;
        this.loading = false;
      },
      error: ()=>{
        this.loading = false;
        this.error = 'Error al cargar los reportes';
        console.log('Error al cargar los reportes');
      }
    })

  }
  generateReport(){
    const body:ReserveReport = {
      dateStart: this.dateStart,
      dateEnd: this.dateEnd
    }
    this.reserveService.getReportExcel(body).subscribe({
      next: response =>{
        const contentDisposition = response.headers.get('Content-Disposition') ?? '';
        let filename = 'Report.xlsx';
        const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1];
        }
        const blob = response.body as Blob;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: err => {
        alert('Error al generar el archivo Excel');
      }
    })

  }
  onChange(){
    this.getData(this.dateStart, this.dateEnd);
  }
  onClose(){
    this.close.emit();
  }
}
