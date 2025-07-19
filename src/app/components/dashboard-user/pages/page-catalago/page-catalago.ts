import { Component, inject, OnInit } from '@angular/core';
import { BookService, Book } from '../../../../services/book/book-service';
import { DatePipe, CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-page-catalago',
  imports: [DatePipe, ReactiveFormsModule, CommonModule],
  templateUrl: './page-catalago.html',
  styleUrl: './page-catalago.css',
})
export class PageCatalago implements OnInit {
  bookService = inject(BookService);
  form!: FormGroup;
  fb = inject(FormBuilder);

  booksAvailable: Book[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.getBooks();
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      authorName: ['', [Validators.pattern('^[a-zA-Z ]*$')]],
      title: ['', [Validators.pattern('^[a-zA-Z ]*$')]],
      category: [''],
    });
  }

  recargar() {
    this.getBooks();
    this.form.reset();
  }

  buscar(name: string) {
    console.log('valor de nombre de autor', name);
    if (!name || name.trim() === '') {
      console.log('No se ha ingresado un nombre de autor');
      return;
    }

    this.searchBookByAuthor(name);
  }

  buscarTitulo(title: string) {
    if (!title || title.trim() === '') {
      return;
    }
    this.searchBookByTitle(title);
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

  searchBookByAuthor(authorName: string): void {
    this.loading = true;
    this.errorMessage = null;
    this.bookService.searchAutor(authorName).subscribe({
      next: (response: Book[]) => {
        if (!response || response.length === 0) {
          this.loading = false;
          this.errorMessage =
            'No se encontraron libros para el autor proporcionado';
        } else {
          this.booksAvailable = response;
          this.loading = false;
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Error al buscar libros por autor';
        console.error('Error al buscar libros por autor:', error);
      },
    });
  }

  searchBookByTitle(title: string): void {
    this.loading = true;
    this.errorMessage = null;
    this.bookService.getBuscarTitle(title).subscribe({
      next: (response: Book[]) => {
        if (!response || response.length === 0) {
          this.loading = false;
          this.errorMessage =
            'No se encontraron libros para el título proporcionado';
        } else {
          this.booksAvailable = response;
          this.loading = false;
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Error al buscar libros por título';
        console.error('Error al buscar libros por título:', error);
      },
    });
  }

  searchCaetegory(category: string): void {
    this.loading = true;
    this.errorMessage = null;
    if (!category || category.trim() === '') {
      this.loading = false;
      return;
    }
    this.bookService.searchCategory(category).subscribe({
      next: (response: Book[]) => {
        if (!response || response.length === 0) {
          this.loading = false;
          this.errorMessage =
            'No se encontraron libros para la categoría proporcionada';
        } else {
          this.booksAvailable = response;
          this.loading = false;
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Error al buscar libros por categoría';
        console.error('Error al buscar libros por categoría:', error);
        console.log('Status del error:', error.status);
      },
    });
  }
}
