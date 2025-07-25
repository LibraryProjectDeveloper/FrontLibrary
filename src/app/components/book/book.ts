import { Component, OnInit } from '@angular/core';
import { BookService, Book } from '../../services/book/book-service';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/book/category';
import { FormsModule } from '@angular/forms';
import { Modal } from '../modal/modal';
import { ModalDelete } from '../modal-delete/modal-delete';
import { ModalReportBook } from '../modal-report-book/modal-report-book';
import { DetModalBook } from './det-modal-book/det-modal-book';
import { PageResponse } from '../../model/PageResponse';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Modal,
    ModalDelete,
    ModalReportBook,
    DetModalBook,
  ],
  templateUrl: './book.html',
  styleUrl: './book.scss',
})
export class BookComponent implements OnInit {
  Books: Book[] = [];
  Categories: String[] = [];
  loading: boolean = true;
  error: string | null = null;
  categoria: string = '';
  year: number = 0;
  state: string = '';

  showModal = false;
  editMode = false;
  showDeleteModal = false;
  showReportModal = false;
  bookToDelete: Book | null = null;

  // Variables para el modal de detalles
  showDetailModal = false;
  selectedBookDetail: Book | null = null;
  selectedBook: Book | null = null;
  bookDelete: Book | null = null;

  //variables para la paginacion
  page: number = 0;
  size: number = 5;
  totalElements: number = 0;
  totalPages: number = 0;
  pagesArray: number[] = [];
  currentPage: number = 0;
  constructor(
    private bookService: BookService,
    private category: CategoryService
  ) {}
  ngOnInit(): void {
    this.getData();
    this.getCategories();
  }
  getData(page: number = 0, size: number = 5): void {
    //  this.resetearVariablesPages();
    this.loading = true;
    this.error = null;
    this.bookService.getBooks(page, size).subscribe({
      next: (response: PageResponse<Book>) => {
        console.log('Libros obtenidos:', response);
        this.Books = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.page;
        this.pagesArray = Array.from(
          { length: this.totalPages },
          (_, i) => i + 1
        );
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar los libros';
        console.log('Error al cargar los libros');
      },
    });
  }
  getCategories(): void {
    this.category.getCategories().subscribe({
      next: (response: String[]) => {
        this.Categories = response;
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar las categorias';
        console.log('Error al cargar las categorias');
      },
    });
  }

  getSelection(page: number = 0): void {
    if (!this.categoria) {
      this.getData();
      return;
    }
    // this.resetearVariablesPages();
    this.loading = true;
    this.error = null;
    this.bookService
      .getBookCategory(this.categoria, page, this.size)
      .subscribe({
        next: (response: PageResponse<Book>) => {
          console.log('Libros obtenidos por categoria:', response);
          this.Books = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.currentPage = response.page;
          this.pagesArray = Array.from(
            { length: this.totalPages },
            (_, i) => i + 1
          );
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Error al cargar los libros';
          console.log('Error: ', err);
        },
      });
  }

  getState(page: number = 0): void {
    if (!this.state) {
      this.getData();
      return;
    }
    //this.resetearVariablesPages();
    this.loading = true;
    this.error = null;
    this.bookService.getBookState(this.state, page, this.size).subscribe({
      next: (response: PageResponse<Book>) => {
        this.Books = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.page;
        this.pagesArray = Array.from(
          { length: this.totalPages },
          (_, i) => i + 1
        );
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al cargar los libros';
        console.log(`Error al filtrar por estado: `, err);
      },
    });
  }
  getYear(page: number = 0, size: number = 5) {
    if (this.year === 0 || !this.year) {
      this.getData();
      return;
    }

    this.loading = true;
    this.error = null;
    this.bookService.getBookYear(this.year, page, size).subscribe({
      next: (response: PageResponse<Book>) => {
        if (response.content.length === 0) {
          alert('No se encontraron libros con el año ingresado');
          this.loading = false;
          this.year = 0;
          return;
        }
        this.Books = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.page;
        this.pagesArray = Array.from(
          { length: this.totalPages },
          (_, i) => i + 1
        );
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al cargar los libros';
        console.log(`Error al filtrar por año: `, err);
      },
    });
  }

  addBook() {
    console.log('esta haciendo click en addBook');
    this.editMode = false;
    this.selectedBook = null;
    this.showModal = true;
    console.log('showModal:', this.showModal);
  }
  generateReport() {
    const body = {
      dateStart: '2024-07-01',
      dateEnd: '2025-07-12',
      category: '',
    };
    this.bookService.getReportExcel(body).subscribe({
      next: (response) => {
        const contentDisposition =
          response.headers.get('Content-Disposition') ?? '';
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
      error: (err) => {
        alert('Error al generar el archivo Excel');
      },
    });
  }

  editBook(book: Book) {
    console.log('Esta haciendo clicj en editBook', book);
    this.editMode = true;
    this.selectedBook = { ...book };
    this.showModal = true;
  }

  handleSave(book: Book) {
    if (this.editMode) {
      const id = this.selectedBook?.codeBook;
      if (id) {
        book.codeBook = id;
      }
      //console.log("editado libro: ",book);
      this.updateBook(book, id);
    } else {
      console.log('guardando libro: ', book);
      this.createBook(book);
    }
    this.showModal = false;
  }
  closeModal() {
    this.showModal = false;
  }
  openReportModal() {
    this.showReportModal = true;
  }
  closeReportModal() {
    this.showReportModal = false;
  }

  openDetailModal(book: Book) {
    this.selectedBookDetail = book;
    this.showDetailModal = true;
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedBookDetail = null;
  }

  updateBook(book: Book, id: any) {
    return this.bookService.putBook(book, id).subscribe({
      next: (res) => {
        alert('Libro actualizado');
        //console.log("Libro actualizado",res);
        this.getData();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        alert('Error al actualizar el libro');
        console.error('Error al actualizar:', err);
      },
    });
  }

  createBook(book: Book) {
    this.loading = true;
    this.bookService.addBook(book).subscribe({
      next: (response) => {
        alert('Libro guardado');
        // console.log("Libro creado",response);
        this.getData();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        alert('Error al guardar el libro');
        console.error('Error al crear:', err);
      },
    });
  }
  openDeleteModal(book: Book) {
    this.bookDelete = { ...book };
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.bookToDelete = null;
  }
  confirmDelete(book: Book) {
    this.bookService.deleteBook(book.codeBook).subscribe({
      next: () => {
        alert('Libro eliminado');
        this.getData();
        this.closeDeleteModal();
      },
      error: () => {
        alert('Error al eliminar el libro');
        this.closeDeleteModal();
      },
    });
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5; // Número máximo de páginas visibles

    // Si hay pocas páginas, mostrar todas
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i < this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Lógica para mostrar páginas alrededor de la página actual
    let startPage = Math.max(1, this.currentPage - 1);
    let endPage = Math.min(this.totalPages - 1, this.currentPage + 1);

    // Ajustar si estamos muy cerca del inicio
    if (this.currentPage <= 2) {
      endPage = Math.min(this.totalPages - 1, 3);
    }

    // Ajustar si estamos muy cerca del final
    if (this.currentPage >= this.totalPages - 2) {
      startPage = Math.max(1, this.totalPages - 3);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  goPage(page: number) {
    if (page < 0 || page >= this.totalPages) {
      console.error('Número de página inválido:', page);
      return;
    }
    this.page = page;

    // Determinar qué método usar según los filtros activos
    if (this.categoria && this.categoria !== '') {
      this.getSelection(page);
    } else if (this.state && this.state !== '') {
      this.getState(page);
    } else if (this.year && this.year !== 0) {
      this.getYear(page);
    } else {
      this.getData(this.page, this.size);
    }
  }
}
