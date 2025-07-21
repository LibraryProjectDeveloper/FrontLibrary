import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Reserve,
  ReserveRequest,
  ReserveService,
} from '../../services/reserve/reserve-service';
import { debounceTime } from 'rxjs';
import { User, UserService } from '../../services/user/user-service';
import { PageResponse } from '../../model/PageResponse';
import { BookResponse, BookService } from '../../services/book/book-service';
import { AuthService } from '../../services/auth/auth-service';
@Component({
  selector: 'app-modal-reserva',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-reserva.html',
  styleUrl: './modal-reserva.css',
})
export class ModalReserva implements OnInit, OnChanges {
  @Input() isVisible: boolean = false;
  @Input() reserveEdit: Reserve | null = null;
  @Input() editMode: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<ReserveRequest>();
  formSave!: FormGroup;
  fb: FormBuilder = inject(FormBuilder);

  userService = inject(UserService);
  bookService = inject(BookService);
  usuario: User | null = null;
  isSearchingUser: boolean = false;
  userSearchError: string | null = null;

  books: BookResponse[] = [];
  bookSelected: BookResponse | null = null;
  authService = inject(AuthService);

  reserveRequest: ReserveRequest | null = null;
  ngOnInit(): void {
    console.log('date: ', this.date.toLocaleDateString());
    console.log('date ISO: ', this.getFormattedDate(this.date)); // Debug
    this.initForm();

    this.formSave
      .get('userSearch')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((value) => {
        // Validar que el campo no tenga errores antes de buscar
        const userSearchControl = this.formSave.get('userSearch');

        if (
          userSearchControl &&
          userSearchControl.valid &&
          value &&
          value.trim() !== ''
        ) {
          console.log('Buscando usuario con DNI válido:', value);
          this.searchUser(value);
        } else {
          this.usuario = null;
          this.userSearchError = null;
          this.isSearchingUser = false;

          if (userSearchControl && userSearchControl.invalid) {
            console.log('Campo userSearch inválido, no se realizará búsqueda');
          }
        }
      });

    this.formSave
      .get('bookSearch')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((value) => {
        const valuBookSearch = this.formSave.get('bookSearch');
        if (
          valuBookSearch &&
          valuBookSearch.valid &&
          value &&
          value.trim() !== ''
        ) {
          console.log('Buscando libro con título válido:', value);
          this.searchBook(value);
        } else {
          this.books = [];
          console.log(
            'Campo bookSearch inválido o vacío, no se realizará búsqueda'
          );
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reserveEdit'] && this.reserveEdit) {
      this.editMode = true;
      this.formSave.patchValue({
        reservationDate: this.reserveEdit.reservationDate,
        startTime: this.reserveEdit.startTime,
        endTime: this.reserveEdit.endTime,
        state: String(this.reserveEdit.active),
      });

      this.bookService.getBuscarTitle(this.reserveEdit.bookTitle).subscribe({
        next: (response) => {
          console.log('Libro encontrado:', response);
          if (Array.isArray(response) && response.length > 0) {
            this.bookSelected = response[0];
          } else {
            console.log('No se encontraron libros con el título');
          }
        },
        error: (error) => {
          console.error('Error al buscar libro:', error);
        },
      });
    }
  }

  date = new Date();

  // Método para obtener fecha en formato ISO (YYYY-MM-DD)
  getFormattedDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onClose() {
    this.resetForm();
    this.close.emit();
  }
  // Validador personalizado para fechas no pasadas
  dateNotPast(control: FormControl): { [key: string]: any } | null {
    if (!control.value) return null;

    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fecha

    return inputDate >= today ? null : { dateInPast: true };
  }

  initForm() {
    this.formSave = this.fb.group({
      userSearch: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{8}$'), // DNI debe tener exactamente 8 dígitos
        Validators.minLength(8),
        Validators.maxLength(8),
      ]),
      bookSearch: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$'),
      ]),
      reservationDate: new FormControl('', [
        Validators.required,
        this.dateNotPast.bind(this),
      ]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      state: new FormControl('true', [Validators.required]),
    });
  }

  searchUser(dni: string): void {
    this.isSearchingUser = true;
    this.userSearchError = null;

    this.userService.searchUser(dni, 0, 10).subscribe({
      next: (response: PageResponse<User>) => {
        console.log('Usuario encontrado:', response);
        this.isSearchingUser = false;

        // PageResponse contiene un array de usuarios en la propiedad 'content'
        if (response.content && response.content.length > 0) {
          // Tomar el primer usuario del resultado paginado
          this.usuario = response.content[0];
          console.log('Usuario válido encontrado:', this.usuario);
          this.userSearchError = null;
        } else {
          console.log('No se encontró usuario con el DNI:', dni);
          this.usuario = null;
          this.userSearchError = `No se encontró usuario con el DNI: ${dni}`;
        }
      },
      error: (error) => {
        console.error('Error al buscar usuario:', error);
        this.isSearchingUser = false;
        this.usuario = null;
        if (error.status === 404) {
          this.userSearchError = `No se encontró usuario con el DNI: ${dni}`;
        }
      },
    });
  }

  searchBook(title: string) {
    this.bookService.getBuscarTitle(title).subscribe({
      next: (response) => {
        console.log('Libro encontrado:', response);
        if (Array.isArray(response) && response.length > 0) {
          this.books = response;
        } else {
          console.log('No se encontraron libros con el título:', title);
        }
      },
      error: (error) => {
        console.error('Error al buscar libro:', error);
      },
    });
  }

  getUserSearchErrorMessage(): string | null {
    const control = this.formSave.get('userSearch');
    if (control && control.invalid && control.touched) {
      if (control.errors?.['required']) {
        return 'El DNI es obligatorio';
      }
      if (control.errors?.['pattern']) {
        return 'El DNI debe contener exactamente 8 dígitos';
      }
      if (control.errors?.['minlength'] || control.errors?.['maxlength']) {
        return 'El DNI debe tener exactamente 8 dígitos';
      }
    }
    return null;
  }

  selectBook(book: BookResponse) {
    this.bookSelected = book;
    this.books = [];
    console.log('Libro seleccionado:', book);
  }

  removeBook() {
    this.bookSelected = null;
    console.log('Libro seleccionado eliminado');
  }

  saveReserve() {
    if (!this.usuario && !this.bookSelected) {
      return;
    }

    if (!this.editMode && !this.reserveEdit) {
      const reserva: ReserveRequest = {
        userId: this.usuario?.idUsuario || 0,
        bookId: this.bookSelected?.codeBook || 0,
        libraryId: this.authService.getUserId() || 0,
      };
      console.log('Reserva a guardar:', reserva);
      this.save.emit(reserva);
      this.resetForm();
    } else {
      const reserva: ReserveRequest = {
        id: this.reserveEdit?.id || 0,
        bookId: this.bookSelected?.codeBook || 0,
        reservationDate: this.formSave.get('reservationDate')?.value,
        startTime: this.formSave.get('startTime')?.value,
        endTime: this.formSave.get('endTime')?.value,
        isActive: this.formSave.get('state')?.value === 'true',
      };
      console.log('Reserva a actualizar:', reserva);
      this.save.emit(reserva);
      this.resetForm();
    }
  }

  resetForm() {
    this.formSave.reset({
      userSearch: '',
      bookSearch: '',
      reservationDate: '',
      startTime: '',
      endTime: '',
      state: 'true',
    });
    this.usuario = null;
    this.bookSelected = null;
    this.books = [];
  }
}
