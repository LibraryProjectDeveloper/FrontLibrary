import { Component, inject, OnInit } from '@angular/core';
import { BookService, Book } from '../../../../services/book/book-service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-page-catalago',
  imports: [DatePipe],
  templateUrl: './page-catalago.html',
  styleUrl: './page-catalago.css',
})
export class PageCatalago implements OnInit {
  bookService = inject(BookService);
  booksAvailable: Book[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks() {
    this.loading = true;
    this.errorMessage = null;
    this.bookService.getBookAvailable().subscribe({
      next: (response: Book[]) => {
        this.booksAvailable = response;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Error al cargar los libros disponibles';
        console.error('Error al cargar los libros:', error);
      },
    });
  }

  getAuthorsNames(book: Book): string {
    if (
      !book.author ||
      !Array.isArray(book.author) ||
      book.author.length === 0
    ) {
      return 'Sin autores';
    }
    return book.author
      .map((author) => `${author.names} ${author.lastname}`)
      .join(', ');
  }
}
