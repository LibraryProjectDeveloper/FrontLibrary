import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Book } from '../../../services/book/book-service';

declare var bootstrap: any;

@Component({
  selector: 'app-det-modal-book',
  imports: [DatePipe],
  templateUrl: './det-modal-book.html',
  styleUrl: './det-modal-book.css',
})
export class DetModalBook implements OnChanges {
  @Input() showModal: boolean = false;
  @Input() selectedBook: Book | null = null;
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
      const modalElement = document.getElementById('bookDetailModal');
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

  getAuthorsNames(): string {
    if (
      !this.selectedBook?.author ||
      !Array.isArray(this.selectedBook.author) ||
      this.selectedBook.author.length === 0
    ) {
      return 'Sin autores';
    }
    return this.selectedBook.author
      .map((author) => `${author.names} ${author.lastname}`)
      .join(', ');
  }
}
