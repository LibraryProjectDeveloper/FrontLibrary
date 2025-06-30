import { Component ,OnInit} from '@angular/core';
import{BookService,Book} from '../../services/book/book-service';
import {CommonModule} from '@angular/common';
import {CategoryService} from '../../services/book/category';
import {FormsModule} from '@angular/forms';
import {Modal} from '../modal/modal';
import {ModalDelete} from '../modal-delete/modal-delete';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal,ModalDelete],
  templateUrl: './book.html',
  styleUrl: './book.scss'
})
export class BookComponent implements OnInit {
  Books : Book[] = [];
  Categories : String[] = [];
  loading : boolean = true;
  error : string | null = null;
  categoria: string = "";
  year: number = 0;
  state: string = "";

  showModal = false;
  editMode = false;
  showDeleteModal = false;
  bookToDelete: Book | null = null;
  selectedBook: Book | null = null;
  bookDelete: Book | null = null;
  constructor(private bookService:BookService, private category:CategoryService) {
  }
  ngOnInit():void{
    this.getData();
    this.getCategories();
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
  getCategories() :void {
    this.category.getCategories().subscribe({
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

  getSelection():void{
    console.log(this.categoria)
    if (!this.categoria){
      this.getData();
      this.loading = false;
      return
    }
    this.loading = true;
    this.error = null;
    this.bookService.getBookCategory(this.categoria).subscribe({
      next: (response)=>{
        this.Books = response;
        this.loading = false;
      },
      error: (err)=>{
        this.loading = false;
        this.error = 'Error al cargar los libros';
        console.log("Error: ",err);
      }
    });
  }

  getState(){
    if (!this.state){
      this.getData();
      return;
    }
    this.loading = true;
    this.error = null;
     this.bookService.getBookState(this.state).subscribe(
      {
        next: (response:Book[])=>{
          this.Books = response;
          this.loading = false;
        },error: (err) => {
          this.loading = false;
          this.error = 'Error al cargar los libros';
          console.log(`Error al filtrar por estado: `,err);
        }
      }
    );
  }
  getYear() {
    if (this.year === 0 || !this.year) {
      this.getData();
      return;
    }

    this.loading = true;
    this.error = null;
     this.bookService.getBookYear(this.year).subscribe({
      next: (response:Book[])=>{
        if (response.length === 0){
          alert('No se encontraron libros con el año ingresado');
          this.loading = false;
          this.year = 0;
          return;
        }
        this.Books = response;
        this.loading = false;
      },
      error: (err)=> {
        this.loading = false;
        this.error = 'Error al cargar los libros';
        console.log(`Error al filtrar por año: `,err);
      }
    })
  }

  addBook(){
    console.log("esta haciendo click en addBook")
    this.editMode = false;
    this.selectedBook = null;
    this.showModal = true;
    console.log("showModal:",this.showModal);
  }

  editBook(book: Book) {
    console.log("Esta haciendo clicj en editBook",book);
    this.editMode = true;
    this.selectedBook = {...book};
    this.showModal = true;
  }

  handleSave(book: Book) {
    if (this.editMode) {
        const id = this.selectedBook?.codeBook;
        if (id){
          book.codeBook=id;
        }
      //console.log("editado libro: ",book);
      this.updateBook(book,id);
    } else {
      console.log("guardando libro: ",book);
      this.createBook(book);
    }
    this.showModal = false;
  }
  closeModal() {
    this.showModal = false;
  }

  updateBook(book: Book,id:any) {
    return this.bookService.putBook(book,id).subscribe({
      next: (res) => {
        alert("Libro actualizado");
        //console.log("Libro actualizado",res);
        this.getData();
        this.loading = false;
      },
      error: (err)=> {
        this.loading = false;
        alert('Error al actualizar el libro');
        console.error('Error al actualizar:', err);
      }
    });
  }

  createBook(book:Book){
    this.loading = true;
    this.bookService.addBook(book).subscribe({
      next: (response)=>{
        alert("Libro guardado");
       // console.log("Libro creado",response);
        this.getData();
        this.loading = false;
      },
      error: (err)=>{
        this.loading = false;
        alert('Error al guardar el libro');
        console.error('Error al crear:', err);
      }
    });
  }
  openDeleteModal(book: Book) {
    this.bookDelete = {...book};
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
        }
      });

  }
}
