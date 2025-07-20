import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Loan } from '../../../../model/loan';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-modal-detalle',
  imports: [CommonModule, DatePipe],
  templateUrl: './modal-detalle.html',
  styleUrl: './modal-detalle.css',
})
export class ModalDetalle implements OnChanges {
  @Input() showModal: boolean = false;
  @Input() selectedLoan: Loan | null = null;
  @Output() closeModal = new EventEmitter<void>();

  private modalInstance: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showModal']) {
      if (this.showModal) {
        this.openBootstrapModal();
      } else {
        this.closeBootstrapModal();
      }
    }
  }

  openBootstrapModal(): void {
    setTimeout(() => {
      const modalElement = document.getElementById('detailModal');
      if (modalElement && typeof bootstrap !== 'undefined') {
        this.modalInstance = new bootstrap.Modal(modalElement);
        this.modalInstance.show();

        // Escuchar el evento de cierre del modal
        modalElement.addEventListener('hidden.bs.modal', () => {
          this.onModalClose();
        });
      }
    }, 100);
  }

  closeBootstrapModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  onModalClose(): void {
    this.closeModal.emit();
  }
}
