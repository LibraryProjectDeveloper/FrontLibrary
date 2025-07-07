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
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../services/user/user-service';
@Component({
  selector: 'app-com-modal-user',
  imports: [ReactiveFormsModule],
  templateUrl: './com-modal-user.html',
  styleUrl: './com-modal-user.scss',
})
export class ComModalUser implements OnInit, OnChanges {
  @Input() showModal: boolean = false;
  @Input() editar: boolean = false;
  @Input() user: User | null = null; // Usuario a editar, si es null se asume que es un nuevo usuario
  @Output() closeModal = new EventEmitter<void>();
  userForm!: FormGroup;
  fb = inject(FormBuilder);

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
      }
    }
  }

  initForm() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      address: ['', [Validators.required]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
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
    this.handleStateField();
  }

  closModal() {
    this.closeModal.emit();
  }
}
