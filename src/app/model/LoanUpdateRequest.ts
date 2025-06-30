import {BookResponse} from '../services/book/book-service';

export interface LoanUpdateRequest {
  booksQuantity: number;
  userId: number;
  librarianId: number;
  bookIds: number[];
  loanDays: number;
  state?:string;
}

export interface LoanUpdateResponse {
  booksQuantity: number;
  userId: number;
  librarianId: number;
  books: BookResponse[];
  loanDays: number;
  state?:string;
}
