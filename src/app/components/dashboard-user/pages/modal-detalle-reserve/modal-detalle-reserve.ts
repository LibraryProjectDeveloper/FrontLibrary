import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Reserve } from '../../../../services/reserve/reserve-service';

declare var bootstrap: any;

@Component({
  selector: 'app-modal-detalle-reserve',
  imports: [],
  templateUrl: './modal-detalle-reserve.html',
  styleUrl: './modal-detalle-reserve.css',
})
export class ModalDetalleReserve implements OnChanges {
  @Input() showModal: boolean = false;
  @Input() selectedReserve: Reserve | null = null;
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
      const modalElement = document.getElementById('reserveDetailModal');
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
