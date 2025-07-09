import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delemodal-user',
  imports: [],
  templateUrl: './delemodal-user.html',
  styleUrl: './delemodal-user.css',
})
export class DelemodalUser {
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<number>();
  @Input() idUserDelete: number = 0;
  onConfirm() {
    this.confirm.emit(this.idUserDelete);
  }
  onCancel() {
    this.close.emit();
  }
}
