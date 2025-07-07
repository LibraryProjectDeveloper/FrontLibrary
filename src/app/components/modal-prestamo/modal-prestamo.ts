import {Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth/auth-service';
import {LoanRequest} from '../../model/LoanRequest';
import {debounceTime, distinctUntilChanged, Observable, of, switchMap} from 'rxjs';
import {Book, BookResponse, BookService} from '../../services/book/book-service';
import {User, UserService} from '../../services/user/user-service';
import {LoanUpdateResponse} from '../../model/LoanUpdateRequest';

@Component({
  selector: 'app-modal-prestamo',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './modal-prestamo.html',
  styleUrl: './modal-prestamo.scss'
})
export class ModalPrestamo implements OnInit,OnChanges {
  @Input() isVisible = false;
  @Input() edit: boolean = false;
  @Input() prestUpdate: LoanUpdateResponse | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<LoanRequest>();

  form!: FormGroup;
  authService = inject(AuthService);
  bootService = inject(BookService)
  userService = inject(UserService);

  fb = inject(FormBuilder);
  usuarioResponse!: User[];
  books: Book[] = [];
  booksSeleccionado: BookResponse[] = [];
  usuario: User | null = null;
  errorBooks: string = " ";
  errorUsuario: string = "";
  closeModal(){
    this.form.reset();
    this.booksSeleccionado = [];
    this.usuario = null;
    this.close.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['prestUpdate'] && this.prestUpdate && this.edit) {
      this.loadFormData();
    }
  }

  ngOnInit() {
    this.initForm();
    this.searchBookTitle();
    this.searchUser();
  }

  loadFormData(){
    if (this.prestUpdate){
      this.form.patchValue({
        booksQuantity: this.prestUpdate.booksQuantity,
        librarianId: this.prestUpdate.librarianId,
        loanDays: this.prestUpdate.loanDays
      });

      if (this.edit && this.prestUpdate.state) {
        if (!this.form.get('state')) {
          this.form.addControl('state', this.fb.control(this.prestUpdate.state));
        } else {
          this.form.get('state')?.setValue(this.prestUpdate.state);
        }
      }

      this.booksSeleccionado = this.prestUpdate.books || [];

      this.userService.getUser(this.prestUpdate.userId).subscribe({
        next: (result) => {
          this.usuario = result;
        },error: (err) =>{
          console.log("Ha ocurrido un error al cargar al usuario: ",err);
        }
      })
    }
  }

  initForm():void{
    console.log("User id:",this.authService.getUserId())
    this.form = this.fb.group({
      searchDni: [''],
      librarianId: [this.authService.getUserId(), Validators.required],
      booksQuantity: [1,[Validators.required,Validators.min(1),Validators.pattern(/^[1-9]\d*$/) ]],
      loanDays: [1,[Validators.required,Validators.min(1),Validators.pattern(/^[1-9]\d*$/) ]],
      searchTitle: [''],
      searchCategory:['']
    });

    if (this.edit) {
      this.form.addControl('state', this.fb.control('ACTIVE', Validators.required));
    }
  }

  onSumbit(){
    if (this.booksSeleccionado.length === 0){
      this.errorBooks = "Agrega al menos un libro";
      return;
    }

    if (!this.usuario){
      this.errorUsuario = "Seleccione un usuario";
      return;
    }
    const data = this.form.value;
    const lanRequest : LoanRequest = {
      booksQuantity: this.form.get('booksQuantity')?.value,
      userId: this.usuario.idUsuario,
      librarianId: this.form.get('librarianId')?.value,
      bookIds: this.booksSeleccionado.map(book => book.codeBook),
      loanDays: this.form.get('loanDays')?.value
    };

    if (this.edit && this.form.get('state')) {
      lanRequest.state = this.form.get('state')?.value;
    }

    this.save.emit(lanRequest);
    console.log(lanRequest);
  }

  searchBookTitle(){
    this.form.get('searchTitle')?.valueChanges?.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchItem ) => {
        if (searchItem && searchItem.length > 2){
          return this.getBuscarTitle(searchItem);
        }
        return of([]);
      })
    ).subscribe({
      next: (data) => {
        if (data && data.length > 0){
          this.books = data;
        }else {
          this.books = [];
        }
      },
      error: (err) => {
        console.error("Error en la búsqueda:", err);
      }
    });
  }

  searchUser() {
    this.form.get('searchDni')?.valueChanges?.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchItem) => {
        if (searchItem && searchItem.length > 2) {
          return this.getUserRol(searchItem);
        }
        this.usuarioResponse = [];
        return of([]);
      })
    ).subscribe({
      next: (data) => {
        console.log("usuario encontrado",data);
        if (Array.isArray(data) && data.length > 0) {
          this.usuarioResponse = data;
        } else if (!Array.isArray(data) && data) {
          this.usuarioResponse = [data as User];
        } else {
          this.usuarioResponse = [];
          console.log("No se encontró ningún usuario con ese DNI");
        }
      },
      error: (err) => {
        console.error("Error en la búsqueda por categoría:", err);
        this.usuarioResponse = [];
      }
    });
  }

  getBuscarTitle(tile:string){
    return this.bootService.getBuscarTitle(tile);
  }

  getUserRol(dni:string){
    return this.userService.getUserRol(dni,"USER");
  }

  addUser(user:User){
    this.usuario = user;
    this.usuarioResponse = [];
    this.form.get('searchDni')?.setValue('');
  }

  addBook(book:Book){
    if (!this.booksSeleccionado.some(b => b.codeBook === book.codeBook)){
      this.booksSeleccionado.push(book);
      this.form.get('searchTitle')?.setValue(' ');
      this.books = [];
    }
  }

  removeBook(book: BookResponse) {
    this.booksSeleccionado = this.booksSeleccionado.filter(b => b.codeBook !== book.codeBook);
  }

}
