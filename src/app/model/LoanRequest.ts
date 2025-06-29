export interface LoanRequest{
  booksQuantity: number;
  userId: number;
  librarianId:number;
  bookIds:number[];
  loanDays:number;
}
