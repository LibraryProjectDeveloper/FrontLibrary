import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BookReport, BookReportRequest, BookService} from '../../services/book/book-service';
import {CategoryService} from '../../services/book/category';
import {ReserveReport} from '../../services/reserve/reserve-service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-modal-report-book',
  imports: [
    FormsModule
  ],
  templateUrl: './modal-report-book.html',
  styleUrl: './modal-report-book.scss'
})
export class ModalReportBook implements OnInit{
  Books:BookReport[] = [];
  Categories:String[] = [];
  loading:boolean = true;
  error:string | null = null;
  dateStart: string = '';
  dateEnd: string = '';
  date:string = '';
  stateButton = false;
  category:string = '';
  today : Date = new Date();
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();

  constructor(private bookService:BookService,private categoryService:CategoryService) {}
  ngOnInit() {
    this.getData('', '', '');
    this.getCategories();
  }
  getData(dateStart:string,dateEnd:string,category:string){
    this.loading = true;
    this.error = null;
    this.bookService.getReport(dateStart,dateEnd,category).subscribe({
      next: (response:BookReport[]) => {
        this.Books = response;
        this.stateButton = this.Books.length === 0;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar los reportes';
        console.log('Error al cargar los reportes');
      }
    })
  }
  getCategories() :void {
    this.categoryService.getCategories().subscribe({
      next: (response:String[])=>{
        this.Categories = response;
      },
      error: ()=>{
        this.loading = false;
        this.error = 'Error al cargar las categorias';
        console.log('Error al cargar las categorias');
      }
    })
  }
  generateReport(){
    const body:BookReportRequest = {
      dateStart: this.dateStart,
      dateEnd: this.dateEnd,
      category: this.category
    }
    this.bookService.getReportExcel(body).subscribe({
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
   this.generateRangeDates(this.date);
   this.getData(this.dateStart, this.dateEnd, this.category);
  }
  generateRangeDates(option: string) {
    const hoy = new Date();
    switch(option) {
      case '1':
        this.dateStart = this.formatDate(new Date(hoy));
        this.dateEnd = this.formatDate(new Date(hoy));
        break;
      case '2':
        this.dateStart = this.formatDate(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
        this.dateEnd =  this.formatDate(new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0));
        break;
      case '3':
        const monthStart = hoy.getMonth() - 2;
        const yearStart = hoy.getFullYear() + Math.floor(monthStart / 12);
        const monthCalculate = ((monthStart % 12) + 12) % 12;

        this.dateStart = this.formatDate(new Date(yearStart, monthCalculate,1));
        this.dateEnd = this.formatDate(new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0));
        break;
      case '4':
        this.dateStart = this.formatDate(new Date(hoy.getFullYear(), 0, 1));
        this.dateEnd = this.formatDate(new Date(hoy.getFullYear(), 11, 31));
        break;

      case '5':
        this.dateStart = this.formatDate(new Date(hoy.getFullYear() - 9, 0, 1));
        this.dateEnd = this.formatDate(new Date(hoy.getFullYear(), 11, 31));
        break;

      default:
        this.dateStart = this.formatDate(new Date(hoy));
        this.dateEnd = this.formatDate(new Date(hoy));
    }
  }
  formatDate(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  onClose(){
    this.close.emit();
  }


}
