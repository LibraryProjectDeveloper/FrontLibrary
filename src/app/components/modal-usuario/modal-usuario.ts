import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {User,UserService} from '../../services/user/user-service';

@Component({
  selector: 'app-modal-usuario',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './modal-usuario.html',
  styleUrl: './modal-usuario.scss'
})
export class ModalUsuario implements OnInit,OnChanges {
  @Input() isVisible = false;
  @Input() edit = false;
  @Input() userToEdit: User | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<User>();

  form!: FormGroup;
  idRol: number = 0;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && this.isVisible) {
      this.initForm();
      if (this.edit && this.userToEdit) {
        this.loadUserData();
      }
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      dni: ['', Validators.required],
      password: ['', this.edit ? [] : [Validators.required]],
      role: ['', Validators.required],
      state: [this.edit ? 'ACTIVE' : null]
    });
  }

  loadUserData(): void {
    if (this.userToEdit) {
      this.form.patchValue({
        name: this.userToEdit.name,
        lastname: this.userToEdit.lastname,
        email: this.userToEdit.email,
        phone: this.userToEdit.phone,
        address: this.userToEdit.address,
        dni: this.userToEdit.dni,
        role: this.getIdRol(this.userToEdit.idUsuario),
        state: this.userToEdit.state
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const userData = {
        ...this.form.value
      };

      if (this.edit && this.userToEdit) {
        userData.idUsuario = this.userToEdit.idUsuario;

        if (!userData.password) {
          delete userData.password;
        }
      }

      this.save.emit(userData);
    }
  }

  onClose(): void {
    this.close.emit();
  }

  getIdRol(id:number): number {
    let idRol: number = 0;
    this.userService.getUser(id).subscribe({
      next: res => {
        idRol = res.idRol;
      },error: err => {
        console.log(err);
      }
    })
    return idRol;
  }
}
