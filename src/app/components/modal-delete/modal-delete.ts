import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Book} from '../../services/book/book-service';

@Component({
  selector: 'app-modal-delete',
  imports: [],
  templateUrl: './modal-delete.html',
  styleUrl: './modal-delete.scss'
})
export class ModalDelete {
  @Input() book: Book | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<Book>();

  onCancel() {
    this.close.emit();
  }
  onConfirm() {
    this.confirm.emit(this.book!);
  }
}
