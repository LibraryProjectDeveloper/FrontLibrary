import {Component, EventEmitter, inject, Input, Output, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {Book} from '../../services/book/book-service';
import {CommonModule} from '@angular/common';
import {FormsModule,FormBuilder,FormGroup,ReactiveFormsModule,Validators} from '@angular/forms';
import {AuthorModel} from '../../model/Author';
import {Author} from '../../services/author';
import {dateNotFuture} from '../../validations/validators';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule
  ],
  templateUrl: './modal.html',
  styleUrl: './modal.scss'
})
export class Modal implements OnInit,OnChanges {
  @Input() isVisible = false;
  @Input() editMode = false;
  @Input() bookData: Book | null = null;
  @Input() categories: String[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Book>();
  authorService = inject(Author)
  authors: AuthorModel[] = [];
  search:string="";
  query:string[] = [];
  selectedAuthors: AuthorModel[] = [];

  bookForm!: FormGroup;
  constructor(private fb: FormBuilder) {}
  ngOnInit(){
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['bookData'] && this.bookData && this.editMode) {
     this.loadBookDataToForm();
    }
  }

  loadBookDataToForm() {
    this.bookForm.patchValue({
      title: this.bookData?.title || '',
      isbn: this.bookData?.isbn || '',
      publicationDate: this.bookData?.publicationDate || '',
      publisher: this.bookData?.publisher || '',
      category: this.bookData?.category || 'FANTASIA',
      stockTotal: this.bookData?.stockTotal || 1,
      state: this.bookData?.state || 'ACTIVO'
    });

    if (this.bookData?.author && Array.isArray(this.bookData.author)) {
      this.selectedAuthors = [...this.bookData.author];
    } else {
      this.selectedAuthors = [];
    }
  }

  initForm(){
    this.bookForm = this.fb.group({
      title: ['', [Validators.required,Validators.maxLength(200),Validators.pattern("^[a-zA-Z0-9ÁÉÍÓÚáéíóúÑñüÜ ,.:;'\"!?()\\-]+$")]],
      category: ['FANTASIA', Validators.required],
      isbn: ['', [Validators.required,Validators.pattern("^(97[89][0-9]{10}|[0-9]{9}[0-9Xx])$")]],
      publisher: ['', [Validators.required,Validators.pattern("^[a-zA-Z0-9ÁÉÍÓÚáéíóúÑñüÜ ,.:;'\"!?()\\-]+$")]],
      publicationDate: ['', [Validators.required,Validators.required,dateNotFuture()]],
      stockTotal: ['15', Validators.required],
      state: ['ACTIVO', Validators.required],
    })
  }

  onClose(){
    this.bookForm.reset();
    this.selectedAuthors = [];
    this.close.emit();
  }
  onSave(){
    console.log(this.bookForm.value);
    const formData = this.bookForm.value;
    const bookToSave = {
      ...formData,
      author: this.selectedAuthors
    };
    console.log(bookToSave);
    this.save.emit(bookToSave);
  }
  searcAutor(){
    if (this.search.trim().length > 0){
      this.query = this.search.split(" ");
      if (this.query.length === 1){
        this.getAuthor(this.query[0],"")
      }
      if (this.query.length >= 2){
        const name = this.query[0];
        const lastName = this.query.slice(1).join(" ");
        this.getAuthor(name, lastName);
      }
    }else {
      this.authors=[];
    }
  }

  getAuthor(name:string,lastName:string){
    this.authorService.getAuthor(name, lastName).subscribe({
      next: (data)=>{
        this.authors=data
        console.log(data)
      },
      error:(err)=>{
        console.log("Error al obtener los autores",err);
      }
    })
  }
  selectAuthor(author: AuthorModel) {
    if (!this.selectedAuthors.some(a => a.idAuthor === author.idAuthor)) {
      this.selectedAuthors.push(author);
    }
    this.search = "";
    this.authors = [];
  }

  removeAuthor(authorId: number) {
    this.selectedAuthors = this.selectedAuthors.filter(a => a.idAuthor !== authorId);
  }

  limpiarIsbn(isbn: string): string {
    return isbn.replace(/[-\s]/g, '').toUpperCase();
  }
}
