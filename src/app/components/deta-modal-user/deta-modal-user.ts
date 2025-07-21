import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { User } from '../../services/user/user-service';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;

@Component({
  selector: 'app-deta-modal-user',
  imports: [CommonModule],
  templateUrl: './deta-modal-user.html',
  styleUrl: './deta-modal-user.css',
})
export class DetaModalUser implements OnChanges {
  @Input() showModal: boolean = false;
  @Input() selectedUser: User | null = null;
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
      const modalElement = document.getElementById('userDetailModal');
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
