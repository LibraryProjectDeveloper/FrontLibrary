import { Component ,OnInit} from '@angular/core';
import{BookService,Book} from '../../services/book/book-service';
import {CommonModule} from '@angular/common';
@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book.html',
  styleUrl: './book.css'
})
export class BookComponent {
  Books : Book[] = [];
  loading : boolean = true;
  error : string | null = null;
  constructor(private bookService:BookService) {
  }
  ngOnInit():void{
    this.getData();
  }
  getData():void{
    this.loading = true;
    this.error = null;
    this.bookService.getBooks().subscribe({
      next: (response:Book[])=>{
        this.Books = response;
        this.loading = false;
      },
      error: ()=>{
        this.loading = false;
        this.error = 'Error al cargar los libros';
        console.log('Error al cargar los libros');
      }
    })
  }

}
