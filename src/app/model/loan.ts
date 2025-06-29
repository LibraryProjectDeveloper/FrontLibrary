import {Book} from '../services/book/book-service';

export interface Loan{
  idLean: number;
  loanDate: string; //fecha prestamo
  devolutionDate: string; //fecha de devolucion
  state: string; //stado
  booksQuantity: number; //numero de libros prestados
  userId: number;
  username: string;
  librarian: number;
  librarianName: string;
  bookResponseList: Book[];
}
