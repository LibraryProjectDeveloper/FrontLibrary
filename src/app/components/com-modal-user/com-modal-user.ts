import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User, UserService } from '../../services/user/user-service';
import { UserRequest } from '../../model/UserRequest';
import { dniExists, emailExists } from '../../validations/validators';
@Component({
  selector: 'app-com-modal-user',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './com-modal-user.html',
  styleUrl: './com-modal-user.scss',
})
export class ComModalUser implements OnInit, OnChanges {
  @Input() showModal: boolean = false;
  @Input() editar: boolean = false;
  @Input() user: User | null = null; // Usuario a editar, si es null se asume que es un nuevo usuario
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveUserEvent = new EventEmitter<UserRequest>();
  userForm!: FormGroup;
  fb = inject(FormBuilder);
  userService = inject(UserService);

  errorEmail: string | null = null;
  errorDni: string | null = null;
  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editar'] && this.userForm) {
      this.handleStateField();
    }

    if (changes['showModal'] && this.userForm) {
      if (this.showModal && !this.editar) {
        // Reiniciar formulario cuando se abre el modal para agregar usuario
        this.resetForm();
      }
    }

    if (changes['user'] && this.user && this.editar) {
      if (this.user) {
        // Actualizar validadores con los datos del usuario actual
        this.updateAsyncValidators();

        this.userForm.patchValue({
          name: this.user?.name || '',
          lastname: this.user?.lastname || '',
          email: this.user?.email || '',
          phone: this.user?.phone || '',
          address: this.user?.address || '',
          dni: this.user?.dni || '',
          password: '', // No se carga la contraseña por seguridad
          idRol: this.user?.idRol || 2,
          state: String(this.user.state), // Convertir booleano a string
        });
        this.userForm.get('password')?.setValidators([Validators.minLength(6)]);
      }
    }
  }

  initForm() {
    this.userForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9ÁÉÍÓÚáéíóúÑñüÜ ,.:;\'"!?()\\-]+$'),
        ],
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9ÁÉÍÓÚáéíóúÑñüÜ ,.:;\'"!?()\\-]+$'),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'),
        ],
        [emailExists(this.userService, undefined)], // Se actualizará en updateAsyncValidators
      ],
      phone: ['', [Validators.required, Validators.pattern('^9[0-9]{8}$')]],
      address: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9ÁÉÍÓÚáéíóúÑñüÜ ,.:;\'"!?()\\-]+$'),
        ],
      ],
      dni: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{8}$')],
        [dniExists(this.userService, undefined)], // Se actualizará en updateAsyncValidators
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      idRol: [2, [Validators.required]], // Valor por defecto: Usuario
      state: ['true', [Validators.required]],
    });

    // Configurar el campo estado según el modo
    this.handleStateField();
  }

  handleStateField() {
    const stateControl = this.userForm.get('state');
    if (stateControl) {
      if (this.editar) {
        // En modo edición: habilitar el campo estado
        stateControl.enable();
      } else {
        // En modo agregar: deshabilitar el campo estado y establecer valor por defecto
        stateControl.setValue('true');
        stateControl.disable();
      }
    }
  }

  resetForm() {
    this.userForm.reset({
      name: '',
      lastname: '',
      email: '',
      phone: '',
      address: '',
      dni: '',
      password: '',
      idRol: 2, // Valor por defecto: Usuario
      state: 'true', // Valor por defecto: Activo
    });

    // Restablecer validadores asíncronos para modo agregar (sin usuario actual)
    const emailControl = this.userForm.get('email');
    if (emailControl) {
      emailControl.setAsyncValidators([
        emailExists(this.userService, undefined),
      ]);
      emailControl.updateValueAndValidity();
    }

    const dniControl = this.userForm.get('dni');
    if (dniControl) {
      dniControl.setAsyncValidators([dniExists(this.userService, undefined)]);
      dniControl.updateValueAndValidity();
    }

    this.handleStateField();
  }

  closModal() {
    this.resetForm();
    this.closeModal.emit();
  }

  saveUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    if (this.editar && this.user) {
      const userData: UserRequest = {
        ...this.userForm.value,
        state: this.userForm.value.state,
        idUsuario: this.user.idUsuario,
      };

      console.log('Editando usuario...:', userData);
      this.saveUserEvent.emit(userData);
      this.closModal();
    } else {
      const userData: UserRequest = {
        ...this.userForm.value,
      };
      this.saveUserEvent.emit(userData);
      this.closModal();
    }
  }

  updateAsyncValidators() {
    // Actualizar validador del email
    const emailControl = this.userForm.get('email');
    if (emailControl) {
      emailControl.setAsyncValidators([
        emailExists(this.userService, this.user?.email),
      ]);
      emailControl.updateValueAndValidity();
    }

    // Actualizar validador del DNI
    const dniControl = this.userForm.get('dni');
    if (dniControl) {
      dniControl.setAsyncValidators([
        dniExists(this.userService, this.user?.dni),
      ]);
      dniControl.updateValueAndValidity();
    }
  }
}
