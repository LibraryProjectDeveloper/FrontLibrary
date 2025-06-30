import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth/auth-service';
import {LoanRequest} from '../../model/LoanRequest';

@Component({
  selector: 'app-modal-prestamo',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './modal-prestamo.html',
  styleUrl: './modal-prestamo.scss'
})
export class ModalPrestamo implements OnInit {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  form!: FormGroup;
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  closeModal(){
    this.close.emit();
  }
  ngOnInit() {
    this.initForm();
  }
  initForm():void{
    this.form = this.fb.group({
      userSearch: ['', Validators.required],
      bookSearch: ['', Validators.required],
      numBooks: [1,[Validators.required,Validators.min(1)]],
      days: [1,[Validators.required,Validators.min(1)]]
    })
  }
}
